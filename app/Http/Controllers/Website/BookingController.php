<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Coupon;
use App\Models\Admin;
use App\Services\BookingService;
use App\Notifications\BookingConfirmation;
use App\Notifications\NewBookingNotification;
// use App\Notifications\BookingConfirmationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Carbon\Carbon;

class BookingController extends Controller
{
    protected $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function create(Request $request)
    {
        $service = null;
        if ($request->service_id) {
            $service = Service::with('category')
                ->active()
                ->findOrFail($request->service_id);
        }

        return Inertia::render('Website/Booking/Create', [
            'service' => $service,
            'services' => Service::with('category')
                ->active()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'duration_hours' => 'required|integer|min:1',
            'frequency' => 'required|in:one_time,weekly,biweekly,monthly',
            'customer_name' => 'required|string|min:2',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string|min:10',
            'customer_address' => 'required|string|min:5',
            'notes' => 'nullable|string',
            'coupon_code' => 'nullable|string',
        ]);

        $validated['booking_date'] = Carbon::parse($request->booking_date)
            ->startOfDay()
            ->setTimezone(config('app.timezone'));
        
        try {
            return \DB::transaction(function () use ($validated, $request) {
                $booking = new Booking($validated);
                
                // Calculate pricing using the BookingService
                $priceBreakdown = $this->bookingService->calculatePricing($validated);
                
                // Set the calculated prices
                $booking->base_amount = $priceBreakdown['base_amount'];
                $booking->frequency_discount = $priceBreakdown['frequency_discount'];
                $booking->bulk_discount = $priceBreakdown['bulk_discount'];
                $booking->special_period_adjustment = $priceBreakdown['special_period_adjustment'];
                $booking->coupon_discount = $priceBreakdown['coupon_discount'];
                $booking->final_amount = $priceBreakdown['final_amount'];
                
                if ($request->coupon_code) {
                    $coupon = Coupon::where('code', $request->coupon_code)
                        ->where('is_active', true)
                        ->lockForUpdate()
                        ->first();
                    
                    if ($coupon && $coupon->canBeUsed()) {
                        $booking->coupon_id = $coupon->id;
                        $coupon->incrementUsage();
                    }
                }

                $booking->status = 'pending';
                $booking->save();

                // Send confirmation email to customer using the updated BookingConfirmation
                $booking->notify(new \App\Notifications\BookingConfirmation($booking));

                // Send notification to admin using the updated NewBookingNotification
                $adminEmail = config('services.notifications.admin_email', 'admin@example.com');
                $admin = new \App\Models\Admin($adminEmail);
                $admin->notify(new \App\Notifications\NewBookingNotification($booking));

                // Schedule a reminder for 24 hours before the booking
                $reminderTime = $booking->booking_date->copy()->subDay();
                if ($reminderTime->isFuture()) {
                    \Illuminate\Support\Facades\Queue::later(
                        $reminderTime,
                        new \App\Jobs\SendBookingReminder($booking)
                    );
                }

                return redirect()
                    ->route('website.booking.confirmation', $booking)
                    ->with('success', 'Your booking has been submitted successfully!');
            });
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function confirmation(Booking $booking)
    {
        $booking->load(['service.category', 'coupon']);

        return Inertia::render('Website/Booking/Confirmation', [
            'booking' => $booking,
        ]);
    }

    public function calculatePrice(Request $request)
    {
        $data = $request->validate([
            'service_id' => 'required|exists:services,id',
            'booking_date' => 'required|date',
            'duration_hours' => 'required|integer|min:1',
            'frequency' => 'required|in:one_time,weekly,biweekly,monthly',
            'coupon_code' => 'nullable|string',
        ]);

        $priceBreakdown = $this->bookingService->calculatePricing($data);

        return response()->json($priceBreakdown);
    }
} 
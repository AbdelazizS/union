<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['service.category', 'coupon'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('booking_number', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%")
                        ->orWhere('customer_email', 'like', "%{$search}%")
                        ->orWhere('customer_phone', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->date_from, function ($query, $date) {
                $query->whereDate('booking_date', '>=', $date);
            })
            ->when($request->date_to, function ($query, $date) {
                $query->whereDate('booking_date', '<=', $date);
            });

        $bookings = $query->latest()->get();

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
        ]);
    }

    public function create()
    {
        $services = Service::with('category')
            ->active()
            ->get();

        return Inertia::render('Admin/Bookings/Create', [
            'services' => $services,
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

        // Ensure the booking date is handled in the application timezone
        $validated['booking_date'] = Carbon::parse($request->booking_date)
            ->startOfDay()
            ->setTimezone(config('app.timezone'));
        
        try {
            return \DB::transaction(function () use ($validated, $request) {
                $booking = new Booking($validated);
                $couponToApply = null;
                
                if ($request->coupon_code) {
                    $coupon = Coupon::where('code', $request->coupon_code)
                        ->where('is_active', true)
                        ->lockForUpdate()
                        ->first();
                    
                    if (!$coupon) {
                        throw new \Exception('Coupon not found or inactive.');
                    }

                    if (!$coupon->canBeUsed()) {
                        throw new \Exception('Coupon cannot be used. It may be expired or reached its usage limit.');
                    }

                    $couponToApply = $coupon;
                    $booking->coupon_id = $coupon->id;
                }

                $booking->calculatePricing();
                $booking->save();

                // Only increment coupon usage after successful booking save
                if ($couponToApply) {
                    $couponToApply->incrementUsage();
                }

                return redirect()
                    ->route('admin.bookings.index')
                    ->with('success', 'Booking created successfully.');
            });
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Booking $booking)
    {
        $booking->load(['service.category', 'coupon']);

        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking,
        ]);
    }

    public function edit(Booking $booking)
    {
        $booking->load(['service.category', 'coupon']);
        
        $services = Service::with('category')
            ->active()
            ->get();

        return Inertia::render('Admin/Bookings/Edit', [
            'booking' => $booking,
            'services' => $services,
        ]);
    }

    public function update(Request $request, Booking $booking)
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

        // Ensure the booking date is handled in the application timezone
        $validated['booking_date'] = Carbon::parse($request->booking_date)
            ->startOfDay()
            ->setTimezone(config('app.timezone'));

        try {
            return \DB::transaction(function () use ($validated, $request, $booking) {
                $couponToApply = null;
                
                // Handle coupon changes
                if ($request->coupon_code !== $booking->coupon?->code) {
                    // If there was a previous coupon, decrement its usage
                    if ($booking->coupon) {
                        $booking->coupon->decrementUsage();
                    }
                    
                    // Remove the old coupon
                    $booking->coupon_id = null;
                    
                    // Apply the new coupon if provided
                    if ($request->coupon_code) {
                        $coupon = Coupon::where('code', $request->coupon_code)
                            ->where('is_active', true)
                            ->lockForUpdate()
                            ->first();

                        if (!$coupon) {
                            throw new \Exception('Coupon not found or inactive.');
                        }

                        if (!$coupon->canBeUsed()) {
                            throw new \Exception('Coupon cannot be used. It may be expired or reached its usage limit.');
                        }

                        $couponToApply = $coupon;
                        $booking->coupon_id = $coupon->id;
                    }
                }

                $booking->fill($validated);
                $booking->calculatePricing();
                $booking->save();

                // Only increment coupon usage after successful booking update
                if ($couponToApply) {
                    $couponToApply->incrementUsage();
                }

                return redirect()
                    ->route('admin.bookings.show', $booking)
                    ->with('success', 'Booking updated successfully.');
            });
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function confirm(Booking $booking)
    {
        if ($booking->status !== 'pending') {
            return back()->with('error', 'Booking cannot be confirmed.');
        }

        try {
            $booking->updateStatus('confirmed');
        return back()->with('success', 'Booking confirmed successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to confirm booking: ' . $e->getMessage());
        }
    }

    public function complete(Booking $booking)
    {
        if ($booking->status !== 'confirmed') {
            return back()->with('error', 'Booking cannot be completed.');
        }

        try {
            $booking->updateStatus('completed');
        return back()->with('success', 'Booking marked as completed.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to complete booking: ' . $e->getMessage());
        }
    }

    public function cancel(Booking $booking)
    {
        if (!in_array($booking->status, ['pending', 'confirmed'])) {
            return back()->with('error', 'Booking cannot be cancelled.');
        }

        try {
            return \DB::transaction(function () use ($booking) {
                // Store the coupon reference before changing status
                $coupon = $booking->coupon;
                
                // Change status using the new method that handles notifications
                $booking->updateStatus('cancelled');

                // If booking had a coupon, decrement its usage
                if ($coupon) {
                    // Reload the coupon to get fresh data
                    $coupon->refresh();
                    
                    // Only decrement if usage count is greater than 0
                    if ($coupon->usage_count > 0) {
                        $coupon->decrementUsage();
                    }
                }

                return back()->with('success', 'Booking cancelled successfully.');
            });
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to cancel booking: ' . $e->getMessage());
        }
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

        $bookingService = new \App\Services\BookingService();
        $priceBreakdown = $bookingService->calculatePricing($data);

        return response()->json($priceBreakdown);
    }
} 
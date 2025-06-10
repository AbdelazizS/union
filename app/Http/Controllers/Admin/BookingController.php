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
        $services = Service::with(['category', 'options' => function ($query) {
            $query->where('is_active', true)
                  ->orderBy('sort_order');
        }])
            ->active()
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'category' => $service->category ? [
                        'id' => $service->category->id,
                        'name' => $service->category->name,
                    ] : null,
                    'options' => $service->options->map(function ($option) {
                        return [
                            'id' => $option->id,
                            'label' => $option->label,
                            'price' => $option->price,
                            'min_qty' => $option->min_qty,
                            'max_qty' => $option->max_qty,
                            'is_variable' => $option->is_variable,
                            'note' => $option->note,
                            'is_active' => $option->is_active,
                        ];
                    }),
                ];
            });

        // Debug log to check services
        \Log::info('Services being passed to view:', ['services' => $services]);

        return Inertia::render('Admin/Bookings/Create', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'selected_options' => 'required|array',
            'selected_options.*.option_id' => 'required|exists:service_options,id',
            'selected_options.*.quantity' => 'nullable|integer|min:1',
            'booking_date' => 'required|date|after_or_equal:today',
            'customer_name' => 'required|string|min:2',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string|min:10',
            'customer_address' => 'required|string|min:5',
            'notes' => 'nullable|string',
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'coupon_code' => 'nullable|string|exists:coupons,code',
        ]);

        try {
            return \DB::transaction(function () use ($validated, $request) {
                // Load the service with its options to calculate pricing
                $service = Service::with(['options' => function ($query) {
                    $query->where('is_active', true);
                }])->findOrFail($validated['service_id']);

                // Calculate base amount from selected options
                $baseAmount = 0;
                $selectedOptionsData = [];
                $hasMultipleQuantity = false;
                
                foreach ($validated['selected_options'] as $selectedOption) {
                    $option = $service->options->firstWhere('id', $selectedOption['option_id']);
                    if ($option) {
                        if ($option->is_variable) {
                            $quantity = $selectedOption['quantity'] ?? 1;
                            // Validate quantity against min/max if set
                            if ($option->min_qty && $quantity < $option->min_qty) {
                                throw new \Exception("Quantity for {$option->label} must be at least {$option->min_qty}");
                            }
                            if ($option->max_qty && $quantity > $option->max_qty) {
                                throw new \Exception("Quantity for {$option->label} cannot exceed {$option->max_qty}");
                            }
                            if ($quantity > 1) {
                                $hasMultipleQuantity = true;
                            }
                            $baseAmount += $option->price * $quantity;
                        } else {
                            $baseAmount += $option->price;
                        }
                        
                        // Store selected option data
                        $selectedOptionsData[] = [
                            'service_option_id' => $selectedOption['option_id'],
                            'quantity' => $selectedOption['quantity'] ?? 1,
                        ];
                    }
                }

                // Round base amount
                $baseAmount = round($baseAmount, 2);

                // Calculate discounts
                $bulkDiscount = 0;
                $couponDiscount = 0;
                
                // Apply 33.33% discount if any option has quantity more than 1
                if ($hasMultipleQuantity) {
                    $bulkDiscount = round($baseAmount * 0.3333, 2);
                }

                // Apply coupon if provided
                $coupon = null;
                if (!empty($validated['coupon_code'])) {
                    $coupon = Coupon::where('code', $validated['coupon_code'])
                        ->where('is_active', true)
                        ->first();
                    
                    if ($coupon) {
                        $couponDiscount = $coupon->calculateDiscount($baseAmount);
                    }
                }

                // Calculate total discount amount
                $discountAmount = round($bulkDiscount + $couponDiscount, 2);

                // Calculate final amount
                $finalAmount = round($baseAmount - $discountAmount, 2);

                // Generate booking number
                $bookingNumber = 'BK-' . strtoupper(substr(md5(uniqid()), 0, 8));

                // Create the booking with all required fields
                $booking = new Booking([
                    'service_id' => $validated['service_id'],
                    'booking_date' => $validated['booking_date'],
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'],
                    'customer_address' => $validated['customer_address'],
                    'notes' => $validated['notes'],
                    'status' => $validated['status'],
                    'booking_number' => $bookingNumber,
                    'base_amount' => $baseAmount,
                    'discount_amount' => $discountAmount,
                    'bulk_discount' => $bulkDiscount,
                    'coupon_discount' => $couponDiscount,
                    'final_amount' => $finalAmount,
                    'coupon_id' => $coupon?->id,
                ]);

                $booking->save();

                // Store the selected options with quantities
                foreach ($selectedOptionsData as $optionData) {
                    $booking->serviceOptions()->create($optionData);
                }

                return redirect()
                    ->route('admin.bookings.index')
                    ->with('success', 'Booking created successfully.');
            });
        } catch (\Exception $e) {
            \Log::error('Booking creation error: ' . $e->getMessage());
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
        
        $services = Service::with(['category', 'options' => function ($query) {
            $query->where('is_active', true)
                  ->orderBy('sort_order');
        }])
            ->active()
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'category' => $service->category ? [
                        'id' => $service->category->id,
                        'name' => $service->category->name,
                    ] : null,
                    'options' => $service->options->map(function ($option) {
                        return [
                            'id' => $option->id,
                            'label' => $option->label,
                            'price' => $option->price,
                            'min_qty' => $option->min_qty,
                            'max_qty' => $option->max_qty,
                            'is_variable' => $option->is_variable,
                            'note' => $option->note,
                            'is_active' => $option->is_active,
                        ];
                    }),
                ];
            });

        return Inertia::render('Admin/Bookings/Edit', [
            'booking' => $booking,
            'services' => $services,
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'selected_options' => 'required|array',
            'selected_options.*.option_id' => 'required|exists:service_options,id',
            'selected_options.*.quantity' => 'nullable|integer|min:1',
            'booking_date' => 'required|date|after_or_equal:today',
            'customer_name' => 'required|string|min:2',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string|min:10',
            'customer_address' => 'required|string|min:5',
            'notes' => 'nullable|string',
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'coupon_code' => 'nullable|string|exists:coupons,code',
        ]);

        try {
            return \DB::transaction(function () use ($validated, $request, $booking) {
                // Load the service with its options to calculate pricing
                $service = Service::with(['options' => function ($query) {
                    $query->where('is_active', true);
                }])->findOrFail($validated['service_id']);

                // Calculate base amount from selected options
                $baseAmount = 0;
                $selectedOptionsData = [];
                $hasMultipleQuantity = false;
                
                foreach ($validated['selected_options'] as $selectedOption) {
                    $option = $service->options->firstWhere('id', $selectedOption['option_id']);
                    if ($option) {
                        if ($option->is_variable) {
                            $quantity = $selectedOption['quantity'] ?? 1;
                            // Validate quantity against min/max if set
                            if ($option->min_qty && $quantity < $option->min_qty) {
                                throw new \Exception("Quantity for {$option->label} must be at least {$option->min_qty}");
                            }
                            if ($option->max_qty && $quantity > $option->max_qty) {
                                throw new \Exception("Quantity for {$option->label} cannot exceed {$option->max_qty}");
                            }
                            if ($quantity > 1) {
                                $hasMultipleQuantity = true;
                            }
                            $baseAmount += $option->price * $quantity;
                        } else {
                            $baseAmount += $option->price;
                        }
                        
                        // Store selected option data
                        $selectedOptionsData[] = [
                            'service_option_id' => $selectedOption['option_id'],
                            'quantity' => $selectedOption['quantity'] ?? 1,
                        ];
                    }
                }

                // Round base amount
                $baseAmount = round($baseAmount, 2);

                // Calculate discounts
                $bulkDiscount = 0;
                $couponDiscount = 0;
                
                // Apply 33.33% discount if any option has quantity more than 1
                if ($hasMultipleQuantity) {
                    $bulkDiscount = round($baseAmount * 0.3333, 2);
                }

                // Handle coupon changes
                $coupon = null;
                if ($request->coupon_code !== $booking->coupon?->code) {
                    // If there was a previous coupon, decrement its usage
                    if ($booking->coupon) {
                        $booking->coupon->decrementUsage();
                    }
                    
                    // Apply the new coupon if provided
                    if (!empty($validated['coupon_code'])) {
                        $coupon = Coupon::where('code', $validated['coupon_code'])
                            ->where('is_active', true)
                            ->first();
                        
                        if ($coupon) {
                            $couponDiscount = $coupon->calculateDiscount($baseAmount);
                            $coupon->incrementUsage();
                        }
                    }
                } else if ($booking->coupon) {
                    // Recalculate coupon discount with new base amount
                    $couponDiscount = $booking->coupon->calculateDiscount($baseAmount);
                }

                // Calculate total discount amount
                $discountAmount = round($bulkDiscount + $couponDiscount, 2);

                // Calculate final amount
                $finalAmount = round($baseAmount - $discountAmount, 2);

                // Update the booking
                $booking->fill([
                    'service_id' => $validated['service_id'],
                    'booking_date' => $validated['booking_date'],
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'],
                    'customer_address' => $validated['customer_address'],
                    'notes' => $validated['notes'],
                    'status' => $validated['status'],
                    'base_amount' => $baseAmount,
                    'discount_amount' => $discountAmount,
                    'bulk_discount' => $bulkDiscount,
                    'coupon_discount' => $couponDiscount,
                    'final_amount' => $finalAmount,
                    'coupon_id' => $coupon?->id,
                ]);

                $booking->save();

                // Update the selected options
                $booking->serviceOptions()->delete();
                foreach ($selectedOptionsData as $optionData) {
                    $booking->serviceOptions()->create($optionData);
                }

                return redirect()
                    ->route('admin.bookings.show', $booking)
                    ->with('success', 'Booking updated successfully.');
            });
        } catch (\Exception $e) {
            \Log::error('Booking update error: ' . $e->getMessage());
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
            'frequency' => 'required|in:one_time,weekly,biweekly,monthly',
            'coupon_code' => 'nullable|string',
        ]);

        $bookingService = new \App\Services\BookingService();
        $priceBreakdown = $bookingService->calculatePricing($data);

        return response()->json($priceBreakdown);
    }
} 
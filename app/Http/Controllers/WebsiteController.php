<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Testimonial;
use App\Models\Partner;
use App\Models\Faq;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Models\Booking;
use App\Notifications\BookingConfirmation;
use Carbon\Carbon;
use App\Models\Coupon;
use Illuminate\Support\Facades\Log;

class WebsiteController extends Controller
{
    public function index()
    {
        // Get active categories with their active services
        $services = ServiceCategory::query()
            ->active()
            ->with(['services' => function ($query) {
                $query->active()
                    ->select('id', 'name', 'slug', 'description', 'category_id', 'features', 'image')
                    ->with(['options' => function ($query) {
                        $query->active()->orderBy('price', 'asc');
                    }])
                    ->orderBy('name', 'asc');
            }])
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'services' => $category->services->map(function ($service) {
                        $minPrice = $service->options->min('price') ?? 0;
                        return [
                            'title' => $service->name,
                            'slug' => $service->slug,
                            'description' => $service->description,
                            'price' => $minPrice,
                            'features' => $service->features,
                            'badge' => $minPrice <= 100 ? 'Best Value' : null,
                            'image_url' => $service->image_url,
                            'options' => $service->options->map(function ($option) {
                                $unitText = $option->is_variable ? 
                                    sprintf("(per unit)", $option->min_qty, $option->max_qty) : 
                                    "(per unit)";
                                return [
                                    'id' => $option->id,
                                    'label' => $option->label,
                                    'price' => $option->price,
                                    'is_variable' => $option->is_variable,
                                    'min_qty' => $option->min_qty,
                                    'max_qty' => $option->max_qty,
                                    'formatted_text' => sprintf("%s: £%.2f %s", 
                                        $option->label, 
                                        $option->price,
                                        $unitText
                                    )
                                ];
                            })
                        ];
                    })
                ];
            });

        // Get approved testimonials
        
        $testimonials = Testimonial::query()
            ->approved()
            ->with('booking.service')
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($testimonial) {
                return [
                    'name' => $testimonial->customer_name,
                    'role' => $testimonial->booking?->service?->name ?? 'Customer',
                    'rating' => $testimonial->rating,
                    'content' => $testimonial->comment,
                    'date' => $testimonial->created_at->format('F Y')
                ];
            });

        // Get active partners
        $partners = Partner::query()
            ->active()
            // ->orderBy('sort_order')
            ->get()
            ->map(function ($partner) {
                return [
                    'id' => $partner->id,
                    'name' => $partner->name,
                    'image' => $partner->logo_path,
                    'category' => $partner->description ?? 'Partner'
                ];
            });

        // Get active FAQs
        $faqs = Faq::query()
            ->active()
            ->orderBy('sort_order')
            ->get()
            ->map(function ($faq) {
                return [
                    'question' => $faq->question,
                    'answer' => $faq->answer
                ];
            });

        return Inertia::render('Website/index', [
            'services' => $services,
            'testimonials' => $testimonials,
            'partners' => $partners,
            'faqs' => $faqs,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function services()
    {
        $services = ServiceCategory::query()
            ->active()
            ->with(['services' => function ($query) {
                $query->active()
                    ->select('id', 'name', 'slug', 'description', 'category_id', 'features', 'image')
                    ->with(['options' => function ($query) {
                        $query->active()->orderBy('price', 'asc');
                    }])
                    ->orderBy('name', 'asc');
            }])
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'services' => $category->services->map(function ($service) {
                        $minPrice = $service->options->min('price') ?? 0;
                        return [
                            'title' => $service->name,
                            'slug' => $service->slug,
                            'description' => $service->description,
                            'price' => $minPrice,
                            'features' => $service->features,
                            'badge' => $minPrice <= 100 ? 'Best Value' : null,
                            'image_url' => $service->image_url,
                            'options' => $service->options->map(function ($option) {
                                $unitText = $option->is_variable ? 
                                    sprintf("(per unit)", $option->min_qty, $option->max_qty) : 
                                    "(per unit)";
                                return [
                                    'id' => $option->id,
                                    'label' => $option->label,
                                    'price' => $option->price,
                                    'is_variable' => $option->is_variable,
                                    'min_qty' => $option->min_qty,
                                    'max_qty' => $option->max_qty,
                                    'formatted_text' => sprintf("%s: £%.2f %s", 
                                        $option->label, 
                                        $option->price,
                                        $unitText
                                    )
                                ];
                            })
                        ];
                    })
                ];
            });

        // Get approved testimonials
        $testimonials = Testimonial::query()
            ->approved()
            // ->with('booking.service')
            ->latest()
            ->take(3) // Only take 3 for services page
            ->get()
            ->map(function ($testimonial) {
                return [
                    'id' => $testimonial->id,
                    'name' => $testimonial->customer_name,
                    'role' => $testimonial->booking?->service?->name ?? 'Customer',
                    'rating' => $testimonial->rating,
                    'content' => $testimonial->comment,
                    'date' => $testimonial->created_at->format('F Y')
                ];
            });

        return Inertia::render('Website/Services', [
            'categories' => $services,
            'testimonials' => $testimonials
        ]);
    }

    public function serviceDetail($categorySlug, $serviceSlug)
    {
        // Get the category
        $category = ServiceCategory::query()
            ->where('slug', $categorySlug)
            ->active()
            ->firstOrFail();

        // Get the current service
        $service = $category->services()
            ->where('slug', $serviceSlug)
            ->active()
            ->with(['options' => function ($query) {
                $query->active()->orderBy('price', 'asc');
            }])
            ->firstOrFail();

        // Get related services from the same category
        $relatedServices = $category->services()
            ->active()
            ->where('id', '!=', $service->id)
            ->with(['options' => function ($query) {
                $query->active()->orderBy('price', 'asc');
            }])
            ->take(3)
            ->get()
            ->map(function ($relatedService) {
                $minPrice = $relatedService->options->min('price') ?? 0;
                return [
                    'id' => $relatedService->id,
                    'title' => $relatedService->name,
                    'slug' => $relatedService->slug,
                    'description' => Str::limit($relatedService->description, 100),
                    'price' => $minPrice,
                    'icon' => $relatedService->icon_url ?? null,
                    'image_url' => $relatedService->image_url,
                    'features' => array_slice($relatedService->features ?? [], 0, 3)
                ];
            });

        // Get testimonials
        $testimonials = Testimonial::query()
            ->approved()
            ->with('booking.service')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($testimonial) {
                return [
                    'id' => $testimonial->id,
                    'name' => $testimonial->customer_name,
                    'role' => $testimonial->booking?->service?->name ?? 'Customer',
                    'comment' => $testimonial->comment,
                    'rating' => $testimonial->rating,
                ];
            });

        // Return the view with all necessary data
        return Inertia::render('Website/ServiceDetail', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ],
            'service' => [
                'id' => $service->id,
                'title' => $service->name,
                'slug' => $service->slug,
                'description' => $service->description,
                'price' => $service->options->min('price') ?? 0,
                'features' => $service->features,
                'badge' => ($service->options->min('price') ?? 0) <= 100 ? 'Best Value' : null,
                'full_description' => $service->full_description,
                'image_url' => $service->image_url,
                'options' => $service->options->map(function ($option) {
                    $unitText = $option->is_variable ? 
                        sprintf("(per unit)", $option->min_qty, $option->max_qty) : 
                        "(per unit)";
                    return [
                        'id' => $option->id,
                        'label' => $option->label,
                        'price' => $option->price,
                        'is_variable' => $option->is_variable,
                        'min_qty' => $option->min_qty,
                        'max_qty' => $option->max_qty,
                        'formatted_text' => sprintf("%s: £%.2f %s", 
                            $option->label, 
                            $option->price,
                            $unitText
                        )
                    ];
                }),
                'benefits' => $service->benefits ?? [
                    'Expert Solutions' => 'Benefit from our years of expertise and industry-leading practices',
                    'Time Efficiency' => 'Quick turnaround times without compromising on quality',
                    'Cost-Effective' => 'Competitive pricing with maximum value for your investment',
                    'Dedicated Support' => '24/7 customer support and continuous assistance'
                ],
                'faqs' => $service->faqs ?? []
            ],
            'relatedServices' => $relatedServices,
            'testimonials' => $testimonials
        ]);
    }

    public function about()
    {
        return Inertia::render('Website/About/Index');
    }

    public function contact()
    {
        $faqs = Faq::query()
            ->active()
            ->where('category', 'contact')
            ->orderBy('sort_order')
            ->take(5)
            ->get()
            ->map(function ($faq) {
                return [
                    'question' => $faq->question,
                    'answer' => $faq->answer
                ];
            });

        return Inertia::render('Website/Contact/Index', [
            'faqs' => $faqs
        ]);
    }

    public function submitContactForm(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'min:2', 'max:50'],
                'email' => ['required', 'email', 'min:5', 'max:100'],
                'phone' => ['required', 'string', 'min:10', 'max:20', 'regex:/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/'],
                'subject' => ['nullable', 'string', 'max:100'],
                'message' => ['required', 'string', 'min:10', 'max:1000'],
            ]);

            // Send notification to admin
            try {
                $adminEmail = config('services.notifications.admin_email');
                Log::info('Sending admin notification', ['email' => $adminEmail]);
                
                $admin = new \App\Models\Admin($adminEmail);
                $admin->notify(new \App\Notifications\ContactFormNotification($validated));
                
                Log::info('Admin notification sent successfully');
            } catch (\Exception $e) {
                Log::error('Failed to send admin notification', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }

            // Send confirmation to user
            try {
                Log::info('Sending user confirmation', ['email' => $validated['email']]);
                
                $user = new \App\Models\User(['email' => $validated['email']]);
                $user->notify(new \App\Notifications\ContactFormConfirmation($validated));
                
                Log::info('User confirmation sent successfully');
            } catch (\Exception $e) {
                Log::error('Failed to send user confirmation', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }

            return back()->with('success', 'Your message has been sent successfully!');
        } catch (\Exception $e) {
            Log::error('Contact form submission error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'There was an error sending your message. Please try again.');
        }
    }

    public function submitTestimonial(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // Create testimonial with default values for is_featured and is_approved
        Testimonial::create([
            ...$validated,
            'is_featured' => false,
            'is_approved' => false,
        ]);

        return back()->with('success', 'Thank you for your testimonial! It will be reviewed and published soon.');
    }

    public function booking($serviceId = null)
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

        return Inertia::render('Website/Booking/Create', [
            'services' => $services,
            'selectedServiceId' => $serviceId,
        ]);
    }

    public function storeBooking(Request $request)
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

                // Create the booking
                $booking = new Booking([
                    'service_id' => $validated['service_id'],
                    'booking_date' => Carbon::parse($validated['booking_date'])->startOfDay(),
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'],
                    'customer_address' => $validated['customer_address'],
                    'notes' => $validated['notes'],
                    'status' => 'pending',
                    'booking_number' => $bookingNumber,
                    'base_amount' => $baseAmount,
                    'discount_amount' => $discountAmount,
                    'bulk_discount' => $bulkDiscount,
                    'coupon_discount' => $couponDiscount,
                    'final_amount' => $finalAmount,
                    'coupon_id' => $coupon?->id,
                ]);

                $booking->save();

                // Store the selected options
                foreach ($selectedOptionsData as $optionData) {
                    $booking->serviceOptions()->create($optionData);
                }

                try {
                    // Send confirmation email to customer
                    $booking->notify(new \App\Notifications\BookingConfirmation($booking));

                    // Send notification to admin
                    $adminEmail = config('services.notifications.admin_email', 'uniongate30@gmail.com');
                    $admin = new \App\Models\Admin($adminEmail);
                    $admin->notify(new \App\Notifications\NewBookingNotification($booking));
                    
                    \Log::info('Notifications sent successfully', [
                        'booking_id' => $booking->id,
                        'customer_email' => $booking->customer_email,
                        'admin_email' => $adminEmail
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Failed to send notifications', [
                        'error' => $e->getMessage(),
                        'booking_id' => $booking->id
                    ]);
                }

                return redirect()
                    ->route('website.booking.confirmation', ['booking' => $booking->id])
                    ->with('success', 'Booking created successfully. Please check your email for confirmation.');
            });
        } catch (\Exception $e) {
            \Log::error('Booking creation error: ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function calculatePrice(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'selected_options' => 'required|array',
            'selected_options.*.option_id' => 'required|exists:service_options,id',
            'selected_options.*.quantity' => 'nullable|integer|min:1',
            'coupon_code' => 'nullable|string|exists:coupons,code',
        ]);

        try {
            $service = Service::with(['options' => function ($query) {
                $query->where('is_active', true);
            }])->findOrFail($validated['service_id']);

            $baseAmount = 0;
            $hasMultipleQuantity = false;
            
            foreach ($validated['selected_options'] as $selectedOption) {
                $option = $service->options->firstWhere('id', $selectedOption['option_id']);
                if ($option) {
                    if ($option->is_variable) {
                        $quantity = $selectedOption['quantity'] ?? 1;
                        if ($quantity > 1) {
                            $hasMultipleQuantity = true;
                        }
                        $baseAmount += $option->price * $quantity;
                    } else {
                        $baseAmount += $option->price;
                    }
                }
            }

            $discountAmount = 0;
            
            // Apply 33.33% discount if any option has quantity more than 1
            if ($hasMultipleQuantity) {
                $discountAmount = round($baseAmount * 0.3333, 2);
            }
            
            // Apply coupon discount if provided
            if (!empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', $validated['coupon_code'])
                    ->where('is_active', true)
                    ->first();
                
                if ($coupon) {
                    $couponDiscount = $coupon->calculateDiscount($baseAmount);
                    $discountAmount = max($discountAmount, $couponDiscount);
                }
            }

            // Round all amounts to 2 decimal places
            $baseAmount = round($baseAmount, 2);
            $discountAmount = round($discountAmount, 2);
            $finalAmount = round($baseAmount - $discountAmount, 2);

            return response()->json([
                'base_amount' => $baseAmount,
                'discount_amount' => $discountAmount,
                'final_amount' => $finalAmount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function bookingSuccess(Booking $booking)
    {
        // Load the booking with its relationships
        $booking->load(['service.category', 'serviceOptions.serviceOption', 'coupon']);

        return Inertia::render('Website/Booking/Success', [
            'booking' => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'status' => $booking->status,
                'booking_date' => $booking->booking_date->format('F j, Y'),
                'service' => [
                    'name' => $booking->service->name,
                    'category' => $booking->service->category->name,
                ],
                'selected_options' => $booking->serviceOptions->map(function ($serviceOption) {
                    return [
                        'label' => $serviceOption->serviceOption->label,
                        'quantity' => $serviceOption->quantity,
                        'price' => $serviceOption->serviceOption->price,
                        'total' => $serviceOption->quantity * $serviceOption->serviceOption->price,
                    ];
                }),
                'customer' => [
                    'name' => $booking->customer_name,
                    'email' => $booking->customer_email,
                    'phone' => $booking->customer_phone,
                    'address' => $booking->customer_address,
                ],
                'pricing' => [
                    'base_amount' => $booking->base_amount,
                    'discount_amount' => $booking->discount_amount,
                    'final_amount' => $booking->final_amount,
                ],
                'notes' => $booking->notes,
            ],
        ]);
    }
} 
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

class WebsiteController extends Controller
{
    public function index()
    {
        // Get active categories with their active services
        $services = ServiceCategory::query()
            ->active()
            ->with(['services' => function ($query) {
                $query->active()
                    ->select('id', 'name', 'slug', 'description', 'base_price', 'duration_minutes', 'category_id', 'features', 'image')
                    ->orderBy('base_price', 'asc');
            }])
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'hourly_rate' => $category->hourly_rate,
                    'services' => $category->services->map(function ($service) {
                        return [
                            'title' => $service->name,
                            'slug' => $service->slug,
                            'description' => $service->description,
                            'price' => $service->base_price,
                            'duration' => $service->formatted_duration,
                            'features' => $service->features,
                            'badge' => $service->base_price <= 100 ? 'Best Value' : null,
                            'image_url' => $service->image_url
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
                    ->select('id', 'name', 'slug', 'description', 'base_price', 'duration_minutes', 'category_id', 'features', 'image')
                    ->orderBy('base_price', 'asc');
            }])
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'hourly_rate' => $category->hourly_rate,
                    'services' => $category->services->map(function ($service) {
                        return [
                            'title' => $service->name,
                            'slug' => $service->slug,
                            'description' => $service->description,
                            'price' => $service->base_price,
                            'duration' => $service->formatted_duration,
                            'features' => $service->features,
                            'badge' => $service->base_price <= 100 ? 'Best Value' : null,
                            'image_url' => $service->image_url
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
            ->firstOrFail();

        // Get related services from the same category
        $relatedServices = $category->services()
            ->active()
            ->where('id', '!=', $service->id)
            ->take(3)
            ->get()
            ->map(function ($relatedService) {
                return [
                    'id' => $relatedService->id,
                    'title' => $relatedService->name,
                    'slug' => $relatedService->slug,
                    'description' => Str::limit($relatedService->description, 100),
                    'price' => $relatedService->base_price,
                    'duration' => $relatedService->formatted_duration,
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
                'hourly_rate' => $category->hourly_rate
            ],
            'service' => [
                'id' => $service->id,
                'title' => $service->name,
                'slug' => $service->slug,
                'description' => $service->description,
                'price' => $service->base_price,
                'duration' => $service->formatted_duration,
                'features' => $service->features,
                'badge' => $service->base_price <= 100 ? 'Best Value' : null,
                'full_description' => $service->full_description,
                'image_url' => $service->image_url,
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
            $adminEmail = config('services.notifications.admin_email', 'admin@example.com');
            $admin = new \App\Models\Admin($adminEmail);
            $admin->notify(new \App\Notifications\ContactFormNotification($validated));

            // Send confirmation to user
            $user = new \App\Models\User(['email' => $validated['email']]);
            $user->notify(new \App\Notifications\ContactFormConfirmation($validated));

            return back()->with('success', 'Your message has been sent successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'There was an error sending your message. Please try again.');
        }
    }
} 
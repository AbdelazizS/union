<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebsiteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ServiceCategoryController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\PricingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Website\BookingController as WebsiteBookingController;
use Illuminate\Support\Facades\Mail;

Route::get('/', [WebsiteController::class, 'index'])->name('home');

// Keep the original dashboard route for Breeze
Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin Routes Group
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Service Categories
    Route::resource('service-categories', ServiceCategoryController::class);
    
    // Services
    Route::resource('services', ServiceController::class);
    Route::put('services/{service}/toggle-status', [ServiceController::class, 'toggleStatus'])
        ->name('services.toggle-status');
    
    // Pricing
    Route::get('/pricing', [PricingController::class, 'index'])->name('pricing.index');
    
    // Bookings
    Route::resource('bookings', BookingController::class);
    Route::post('bookings/{booking}/confirm', [BookingController::class, 'confirm'])->name('bookings.confirm');
    Route::post('bookings/{booking}/complete', [BookingController::class, 'complete'])->name('bookings.complete');
    Route::post('bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
    Route::post('bookings/calculate-price', [BookingController::class, 'calculatePrice'])->name('bookings.calculate-price');
    
    // Coupons
    Route::resource('coupons', CouponController::class);
    Route::put('coupons/{coupon}/toggle-status', [CouponController::class, 'toggleStatus'])
        ->name('coupons.toggle-status');
    
    // Testimonials
    Route::resource('testimonials', TestimonialController::class);
    Route::put('testimonials/{testimonial}/toggle-featured', [TestimonialController::class, 'toggleFeatured'])
        ->name('testimonials.toggle-featured');
    Route::put('testimonials/{testimonial}/toggle-approved', [TestimonialController::class, 'toggleApproved'])
        ->name('testimonials.toggle-approved');
    
    // Partners
    Route::resource('partners', PartnerController::class);
    
    // FAQs
    Route::resource('faqs', FaqController::class);
    Route::put('faqs/{faq}/toggle-active', [FaqController::class, 'toggleActive'])
        ->name('faqs.toggle-active');
    Route::post('faqs/update-order', [FaqController::class, 'updateOrder'])
        ->name('faqs.update-order');
    
    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/services', [ReportController::class, 'services'])->name('services');
        Route::get('/bookings', [ReportController::class, 'bookings'])->name('bookings');
        Route::get('/financial', [ReportController::class, 'financial'])->name('financial');
    });
    
    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    Route::get('/settings/export', [SettingController::class, 'export'])->name('settings.export');
    Route::post('/settings/import', [SettingController::class, 'import'])->name('settings.import');
});

// Profile Routes (keep these outside admin group)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/our-services', [WebsiteController::class, 'services'])->name('services');
Route::get('/our-services/{category}/{service}', [WebsiteController::class, 'serviceDetail'])->name('service.detail');

// About Page Route
Route::get('/about', [WebsiteController::class, 'about'])->name('about');

// Website Booking Routes
Route::prefix('booking')->name('website.booking.')->group(function () {
    Route::get('/create', [WebsiteBookingController::class, 'create'])->name('create');
    Route::post('/store', [WebsiteBookingController::class, 'store'])->name('store');
    Route::get('/confirmation/{booking}', [WebsiteBookingController::class, 'confirmation'])->name('confirmation');
    Route::post('/calculate-price', [WebsiteBookingController::class, 'calculatePrice'])->name('calculate-price');
});

Route::get('/contact', [WebsiteController::class, 'contact'])->name('website.contact');
Route::post('/contact', [WebsiteController::class, 'submitContactForm'])->name('website.contact.submit');

// Legal Pages Routes
Route::get('/terms', function () {
    return Inertia::render('Website/Terms/Index');
})->name('website.terms');

Route::get('/privacy', function () {
    return Inertia::render('Website/Privacy/Index');
})->name('website.privacy');

require __DIR__.'/auth.php';

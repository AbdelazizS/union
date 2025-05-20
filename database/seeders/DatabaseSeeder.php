<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceCategory;
use App\Models\Service;
use App\Models\Coupon;
use App\Models\Booking;
use App\Models\Testimonial;
use App\Models\Partner;
use App\Models\Faq;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    protected $faker;

    public function __construct()
    {
        $this->faker = Faker::create();
    }

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TestimonialSeeder::class,
            ServiceCategorySeeder::class,
            ServiceSeeder::class,
            SettingsSeeder::class,
        ]);

       

        // Create coupons
        Coupon::factory()->count(3)->percentage()->create();
        Coupon::factory()->count(2)->fixed()->create();
        Coupon::factory()->count(2)->expired()->create();
        Coupon::factory()->count(2)->upcoming()->create();

        // Create bookings
        Booking::factory()->count(10)->create();
        Booking::factory()->count(5)->withCoupon()->create();
        Booking::factory()->count(3)->pending()->create();
        Booking::factory()->count(3)->confirmed()->create();
        Booking::factory()->count(3)->completed()->create();
        Booking::factory()->count(1)->cancelled()->create();

        // Create testimonials
        Testimonial::factory()
            ->count(8)
            ->approved()
            ->create();

        Testimonial::factory()
            ->count(2)
            ->featured()
            ->highRating()
            ->create();

        // Create partners
        Partner::factory()->count(6)->create();

        // Create FAQs
        $faqCategories = ['General', 'Services', 'Booking', 'Payment', 'Cancellation'];
        foreach ($faqCategories as $category) {
            Faq::factory()->count(3)->create([
                'category' => $category,
                'is_active' => true,
            ]);
        }
    }
}

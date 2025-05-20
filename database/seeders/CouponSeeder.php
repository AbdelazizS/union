<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Coupon;
use Carbon\Carbon;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'FIRSTCLEAN',
                'type' => 'percentage',
                'discount_value' => 20,
                'min_order_amount' => 100,
                'max_discount_amount' => 50,
                'usage_limit' => 1000,
                'usage_count' => 45,
                'valid_from' => Carbon::now(),
                'valid_until' => Carbon::now()->addMonths(3),
                'is_active' => true,
                'applicable_categories' => [1, 2], // Assuming categories 1 and 2 exist
                'applicable_services' => null, // Applies to all services in the categories
            ],
            [
                'code' => 'SUMMER2024',
                'type' => 'percentage',
                'discount_value' => 15,
                'min_order_amount' => 150,
                'max_discount_amount' => 75,
                'usage_limit' => 500,
                'usage_count' => 123,
                'valid_from' => Carbon::now(),
                'valid_until' => Carbon::parse('2024-08-31'),
                'is_active' => true,
                'applicable_categories' => null, // Applies to all categories
                'applicable_services' => null,
            ],
            [
                'code' => 'DEEPCLEAN50',
                'type' => 'fixed',
                'discount_value' => 50,
                'min_order_amount' => 200,
                'max_discount_amount' => null,
                'usage_limit' => 200,
                'usage_count' => 89,
                'valid_from' => Carbon::now(),
                'valid_until' => Carbon::now()->addMonths(1),
                'is_active' => true,
                'applicable_categories' => null,
                'applicable_services' => [1, 2, 3], // Specific services only
            ],
            [
                'code' => 'WEEKLY25',
                'type' => 'percentage',
                'discount_value' => 25,
                'min_order_amount' => 300,
                'max_discount_amount' => 100,
                'usage_limit' => 100,
                'usage_count' => 67,
                'valid_from' => Carbon::now(),
                'valid_until' => Carbon::now()->addWeeks(2),
                'is_active' => true,
                'applicable_categories' => [3], // Specific category
                'applicable_services' => null,
            ],
            [
                'code' => 'SPRING30',
                'type' => 'percentage',
                'discount_value' => 30,
                'min_order_amount' => 250,
                'max_discount_amount' => 150,
                'usage_limit' => 300,
                'usage_count' => 0,
                'valid_from' => Carbon::parse('2024-03-01'),
                'valid_until' => Carbon::parse('2024-05-31'),
                'is_active' => false, // Not active yet
                'applicable_categories' => null,
                'applicable_services' => null,
            ],
        ];

        foreach ($coupons as $coupon) {
            Coupon::create($coupon);
        }
    }
} 
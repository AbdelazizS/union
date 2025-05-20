<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CouponFactory extends Factory
{
    protected $model = Coupon::class;

    public function definition(): array
    {
        return [
            'code' => strtoupper(Str::random(8)),
            'type' => $this->faker->randomElement(['percentage', 'fixed']),
            'discount_value' => $this->faker->randomFloat(2, 5, 50),
            'min_order_amount' => $this->faker->randomFloat(2, 50, 200),
            'max_discount_amount' => $this->faker->randomFloat(2, 100, 500),
            'usage_limit' => $this->faker->numberBetween(10, 100),
            'usage_count' => 0,
            'valid_from' => now(),
            'valid_until' => now()->addMonths(3),
            'is_active' => true,
            'applicable_categories' => null,
            'applicable_services' => null,
        ];
    }

    public function percentage()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'percentage',
                'discount_value' => $this->faker->randomFloat(2, 5, 30),
                'max_discount_amount' => $this->faker->randomFloat(2, 100, 300),
            ];
        });
    }

    public function fixed()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'fixed',
                'discount_value' => $this->faker->randomFloat(2, 10, 100),
                'max_discount_amount' => null,
            ];
        });
    }

    public function expired()
    {
        return $this->state(function (array $attributes) {
            return [
                'valid_until' => now()->subDays(1),
            ];
        });
    }

    public function upcoming()
    {
        return $this->state(function (array $attributes) {
            return [
                'valid_from' => now()->addDays(7),
                'valid_until' => now()->addMonths(3),
            ];
        });
    }
} 
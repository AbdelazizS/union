<?php

namespace Database\Factories;

use App\Models\Testimonial;
use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

class TestimonialFactory extends Factory
{
    protected $model = Testimonial::class;

    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'customer_name' => $this->faker->name,
            'customer_email' => $this->faker->email,
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->paragraph,
            'is_approved' => false,
            'is_featured' => false,
            'images' => $this->faker->optional(0.3)->randomElements([
                $this->faker->imageUrl(800, 600, 'business'),
                $this->faker->imageUrl(800, 600, 'business'),
            ], $this->faker->numberBetween(1, 2)),
        ];
    }

    public function approved()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_approved' => true,
            ];
        });
    }

    public function featured()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_approved' => true,
                'is_featured' => true,
            ];
        });
    }

    public function highRating()
    {
        return $this->state(function (array $attributes) {
            return [
                'rating' => $this->faker->numberBetween(4, 5),
            ];
        });
    }
} 
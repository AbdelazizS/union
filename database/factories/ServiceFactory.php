<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);
        return [
            'category_id' => ServiceCategory::factory(),
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraphs(2, true),
            'base_price' => $this->faker->randomFloat(2, 20, 200),
            'duration_minutes' => $this->faker->randomElement([30, 60, 90, 120, 180, 240]),
            'features' => json_encode($this->faker->words(5)),
            'image' => $this->faker->imageUrl(800, 600, 'business'),
            'is_active' => true,
            // 'sort_order' => $this->faker->numberBetween(1, 100),
        ];
    }

    public function cleaning()
    {
        return $this->state(function (array $attributes) {
            return [
                'category_id' => ServiceCategory::factory()->cleaning(),
                'base_price' => $this->faker->randomFloat(2, 30, 50),
                'features' => json_encode([
                    'Professional Cleaning Equipment',
                    'Eco-friendly Products',
                    'Trained Staff',
                    'Quality Assurance',
                    'Flexible Scheduling'
                ]),
            ];
        });
    }

    public function security()
    {
        return $this->state(function (array $attributes) {
            return [
                'category_id' => ServiceCategory::factory()->security(),
                'base_price' => $this->faker->randomFloat(2, 40, 80),
                'features' => json_encode([
                    'Licensed Security Personnel',
                    '24/7 Monitoring',
                    'Emergency Response',
                    'Access Control',
                    'Security Reports'
                ]),
            ];
        });
    }

    public function education()
    {
        return $this->state(function (array $attributes) {
            return [
                'category_id' => ServiceCategory::factory()->education(),
                'base_price' => $this->faker->randomFloat(2, 35, 70),
                'features' => json_encode([
                    'Certified Instructors',
                    'Customized Curriculum',
                    'Progress Tracking',
                    'Learning Materials',
                    'Flexible Schedule'
                ]),
            ];
        });
    }
} 
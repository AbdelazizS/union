<?php

namespace Database\Factories;

use App\Models\ServiceCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ServiceCategoryFactory extends Factory
{
    protected $model = ServiceCategory::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(2, true);
        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name) . '-' . Str::random(6),
            'description' => $this->faker->paragraph(),
            'hourly_rate' => $this->faker->randomFloat(2, 30, 100),
            'is_active' => true,
        ];
    }

    public function inactive(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'is_active' => false,
            ];
        });
    }

    public function cleaning()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Professional Cleaning',
                'slug' => 'professional-cleaning-' . Str::random(6),
                'hourly_rate' => $this->faker->randomFloat(2, 30, 45),
            ];
        });
    }

    public function security()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Security & Guard Services',
                'slug' => 'security-guard-services-' . Str::random(6),
                'hourly_rate' => $this->faker->randomFloat(2, 40, 75),
            ];
        });
    }

    public function education()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Tutoring & Education',
                'slug' => 'tutoring-education-' . Str::random(6),
                'hourly_rate' => $this->faker->randomFloat(2, 35, 65),
            ];
        });
    }

    public function maintenance()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Home Maintenance',
                'slug' => 'home-maintenance-' . Str::random(6),
                'hourly_rate' => $this->faker->randomFloat(2, 35, 60),
            ];
        });
    }

    public function childcare()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Childcare Services',
                'slug' => 'childcare-services-' . Str::random(6),
                'hourly_rate' => $this->faker->randomFloat(2, 25, 45),
            ];
        });
    }
} 
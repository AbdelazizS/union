<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class ServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Regular Cleaning',
                'description' => 'Standard cleaning services for homes and offices',
                'hourly_rate' => 30.00,
            ],
            [
                'name' => 'Deep Cleaning',
                'description' => 'Thorough cleaning including hard-to-reach areas',
                'hourly_rate' => 45.00,
            ],
            [
                'name' => 'Move In/Out Cleaning',
                'description' => 'Comprehensive cleaning for moving situations',
                'hourly_rate' => 50.00,
            ],
            [
                'name' => 'Commercial Cleaning',
                'description' => 'Professional cleaning services for businesses',
                'hourly_rate' => 40.00,
            ],
        ];

        foreach ($categories as $category) {
            ServiceCategory::create($category);
        }
    }
} 
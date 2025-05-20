<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $regularCleaning = ServiceCategory::where('name', 'Regular Cleaning')->first();
        $deepCleaning = ServiceCategory::where('name', 'Deep Cleaning')->first();
        $moveInOut = ServiceCategory::where('name', 'Move In/Out Cleaning')->first();
        $commercial = ServiceCategory::where('name', 'Commercial Cleaning')->first();

        $services = [
            // Regular Cleaning Services
            [
                'category_id' => $regularCleaning->id,
                'name' => 'Basic House Cleaning',
                'description' => 'Standard cleaning service for residential homes',
                'base_price' => 25.00,
                'duration_minutes' => 120,
                'features' => ['Dusting', 'Vacuuming', 'Mopping', 'Bathroom cleaning', 'Kitchen cleaning'],
                'is_active' => true,
                'image' => 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ],
            [
                'category_id' => $regularCleaning->id,
                'name' => 'Apartment Cleaning',
                'description' => 'Comprehensive cleaning for apartments',
                'base_price' => 30.00,
                'duration_minutes' => 90,
                'features' => ['Dusting', 'Vacuuming', 'Mopping', 'Bathroom cleaning', 'Kitchen cleaning'],
                'is_active' => true,
                'image' => 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ],
            
            // Deep Cleaning Services
            [
                'category_id' => $deepCleaning->id,
                'name' => 'Deep House Cleaning',
                'description' => 'Thorough cleaning of all areas including hard-to-reach spots',
                'base_price' => 40.00,
                'duration_minutes' => 240,
                'features' => ['Deep dusting', 'Baseboards', 'Window sills', 'Cabinet cleaning', 'Appliance cleaning'],
                'is_active' => true,
            ],
            [
                'category_id' => $deepCleaning->id,
                'name' => 'Spring Cleaning',
                'description' => 'Comprehensive deep cleaning service',
                'base_price' => 45.00,
                'duration_minutes' => 300,
                'features' => ['Wall cleaning', 'Light fixtures', 'Window cleaning', 'Furniture cleaning', 'Carpet deep clean'],
                'is_active' => true,
            ],
            
            // Move In/Out Services
            [
                'category_id' => $moveInOut->id,
                'name' => 'Move-Out Cleaning',
                'description' => 'Detailed cleaning service when moving out',
                'base_price' => 50.00,
                'duration_minutes' => 360,
                'features' => ['Cabinet deep clean', 'Appliance cleaning', 'Wall spots', 'Window tracks', 'Full sanitization'],
                'is_active' => true,
            ],
            [
                'category_id' => $moveInOut->id,
                'name' => 'Move-In Cleaning',
                'description' => 'Fresh start cleaning for new homes',
                'base_price' => 50.00,
                'duration_minutes' => 360,
                'features' => ['Sanitization', 'Deep dusting', 'Cabinet cleaning', 'Appliance cleaning', 'Floor deep clean'],
                'is_active' => true,
            ],
            
            // Commercial Services
            [
                'category_id' => $commercial->id,
                'name' => 'Office Cleaning',
                'description' => 'Professional cleaning for office spaces',
                'base_price' => 35.00,
                'duration_minutes' => 180,
                'features' => ['Desk cleaning', 'Floor care', 'Kitchen area', 'Restrooms', 'Trash removal'],
                'is_active' => true,
            ],
            [
                'category_id' => $commercial->id,
                'name' => 'Retail Space Cleaning',
                'description' => 'Cleaning service for retail establishments',
                'base_price' => 35.00,
                'duration_minutes' => 180,
                'features' => ['Floor cleaning', 'Window cleaning', 'Display dusting', 'Restroom sanitization', 'Entrance cleaning'],
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
} 
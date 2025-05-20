<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'customer_name' => 'Sarah Johnson',
                'customer_email' => 'sarah.j@example.com',
                'comment' => 'The cleaning team was incredibly thorough and professional. My house has never looked better! They paid attention to every detail and even cleaned areas I hadn\'t thought about.',
                'rating' => 5,
                'is_featured' => true,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Michael Brown',
                'customer_email' => 'mbrown@example.com',
                'comment' => 'Excellent service! The team arrived on time and did a fantastic job with our office space. Very satisfied with the results and will definitely use their services again.',
                'rating' => 5,
                'is_featured' => true,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Emily Wilson',
                'customer_email' => 'emily.w@example.com',
                'comment' => 'I\'ve been using their cleaning services for 6 months now, and they never disappoint. Consistent quality and great attention to detail.',
                'rating' => 4,
                'is_featured' => false,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'David Martinez',
                'customer_email' => 'd.martinez@example.com',
                'comment' => 'Very professional and efficient service. They did a deep cleaning of my apartment, and it looks amazing. Highly recommend!',
                'rating' => 5,
                'is_featured' => false,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Lisa Anderson',
                'customer_email' => 'lisa.a@example.com',
                'comment' => 'Great experience with the move-out cleaning service. They helped me get my full deposit back! Will definitely use them again.',
                'rating' => 5,
                'is_featured' => true,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'James Thompson',
                'customer_email' => 'j.thompson@example.com',
                'comment' => 'Regular cleaning service is excellent. They\'re always on time and do a thorough job. My home feels fresh and clean every time.',
                'rating' => 4,
                'is_featured' => false,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Patricia Garcia',
                'customer_email' => 'pgarcia@example.com',
                'comment' => 'The spring cleaning service was exactly what my home needed. They cleaned every nook and cranny. Very impressed!',
                'rating' => 5,
                'is_featured' => false,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Robert Lee',
                'customer_email' => 'r.lee@example.com',
                'comment' => 'Outstanding service! The team was professional, efficient, and thorough. They even helped me organize some cluttered areas.',
                'rating' => 5,
                'is_featured' => false,
                'is_approved' => false,
            ],
            [
                'customer_name' => 'Jennifer White',
                'customer_email' => 'jwhite@example.com',
                'comment' => 'First-time user and very impressed. They did an amazing job with my kitchen and bathrooms. Will definitely book again!',
                'rating' => 4,
                'is_featured' => false,
                'is_approved' => false,
            ],
            [
                'customer_name' => 'Thomas Clark',
                'customer_email' => 't.clark@example.com',
                'comment' => 'Used their services for post-renovation cleaning. They did an incredible job removing all the dust and debris. Highly recommended!',
                'rating' => 5,
                'is_featured' => false,
                'is_approved' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
} 
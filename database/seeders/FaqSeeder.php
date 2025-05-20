<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Faq;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            // General Category
            [
                'category' => 'General',
                'question' => 'What areas do you service?',
                'answer' => 'We currently provide cleaning services in [Your Service Areas]. Please contact us to confirm if we serve your specific location.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'category' => 'General',
                'question' => 'Are your cleaning staff background checked?',
                'answer' => 'Yes, all our cleaning professionals undergo thorough background checks and are fully insured. We prioritize your safety and security.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'category' => 'General',
                'question' => 'Do I need to provide cleaning supplies?',
                'answer' => 'No, our cleaning teams bring all necessary professional-grade cleaning supplies and equipment. However, if you prefer specific products, please let us know in advance.',
                'sort_order' => 3,
                'is_active' => true,
            ],

            // Services Category
            [
                'category' => 'Services',
                'question' => 'What types of cleaning services do you offer?',
                'answer' => 'We offer a wide range of services including regular house cleaning, deep cleaning, move-in/move-out cleaning, office cleaning, and specialized cleaning services.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'category' => 'Services',
                'question' => 'How long does a typical cleaning service take?',
                'answer' => 'The duration varies depending on the size of your space and type of service. A standard cleaning for a 2-bedroom home typically takes 2-3 hours, while deep cleaning may take 4-6 hours.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'category' => 'Services',
                'question' => 'Do you offer eco-friendly cleaning options?',
                'answer' => 'Yes, we offer eco-friendly cleaning options using green certified products. Please specify your preference when booking.',
                'sort_order' => 3,
                'is_active' => true,
            ],

            // Booking Category
            [
                'category' => 'Booking',
                'question' => 'How do I schedule a cleaning service?',
                'answer' => 'You can book our services online through our website, mobile app, or by calling our customer service. We offer flexible scheduling options to fit your needs.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'category' => 'Booking',
                'question' => 'Can I schedule recurring cleaning services?',
                'answer' => 'Yes, we offer weekly, bi-weekly, and monthly recurring cleaning services with special pricing options for regular customers.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'category' => 'Booking',
                'question' => 'How far in advance should I book?',
                'answer' => 'We recommend booking at least 48 hours in advance to ensure availability. However, we do our best to accommodate last-minute requests.',
                'sort_order' => 3,
                'is_active' => true,
            ],

            // Payment Category
            [
                'category' => 'Payment',
                'question' => 'What payment methods do you accept?',
                'answer' => 'We accept all major credit cards, digital payments (PayPal, Apple Pay), and bank transfers. Payment is required at the time of booking.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'category' => 'Payment',
                'question' => 'Do you offer any discounts?',
                'answer' => 'Yes, we offer discounts for recurring service bookings and seasonal promotions. New customers may also qualify for first-time service discounts.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'category' => 'Payment',
                'question' => 'What is your pricing structure?',
                'answer' => 'Our pricing is based on the size of your space, type of service, and frequency of cleaning. Contact us for a detailed quote tailored to your needs.',
                'sort_order' => 3,
                'is_active' => true,
            ],

            // Cancellation Category
            [
                'category' => 'Cancellation',
                'question' => 'What is your cancellation policy?',
                'answer' => 'We require 24 hours notice for cancellations. Cancellations made with less than 24 hours notice may incur a cancellation fee.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'category' => 'Cancellation',
                'question' => 'How do I reschedule a cleaning service?',
                'answer' => 'You can reschedule through our website or by calling customer service. Please provide at least 24 hours notice to avoid any fees.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'category' => 'Cancellation',
                'question' => 'What happens if I need to cancel a recurring service?',
                'answer' => 'You can cancel recurring services at any time with 7 days notice. No long-term contracts are required.',
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }
    }
} 
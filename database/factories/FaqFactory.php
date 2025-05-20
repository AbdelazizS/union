<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

class FaqFactory extends Factory
{
    protected $model = Faq::class;

    public function definition(): array
    {
        return [
            'category' => $this->faker->randomElement(['General', 'Services', 'Booking', 'Payment', 'Cancellation']),
            'question' => $this->faker->sentence,
            'answer' => $this->faker->paragraph,
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 100),
            'tags' => $this->faker->words($this->faker->numberBetween(1, 4)),
        ];
    }

    public function inactive()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_active' => false,
            ];
        });
    }
} 
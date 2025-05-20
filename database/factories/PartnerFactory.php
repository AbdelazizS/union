<?php

namespace Database\Factories;

use App\Models\Partner;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PartnerFactory extends Factory
{
    protected $model = Partner::class;

    public function definition(): array
    {
        $name = $this->faker->company;
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'logo_path' => $this->faker->imageUrl(200, 200, 'business', true),
            'website_url' => $this->faker->url,
            'description' => $this->faker->paragraph,
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 100),
            'social_links' => [
                'facebook' => $this->faker->optional()->url,
                'twitter' => $this->faker->optional()->url,
                'linkedin' => $this->faker->optional()->url,
                'instagram' => $this->faker->optional()->url,
            ],
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

    public function withSocialLinks()
    {
        return $this->state(function (array $attributes) {
            return [
                'social_links' => [
                    'facebook' => 'https://facebook.com/' . Str::slug($attributes['name']),
                    'twitter' => 'https://twitter.com/' . Str::slug($attributes['name']),
                    'linkedin' => 'https://linkedin.com/company/' . Str::slug($attributes['name']),
                    'instagram' => 'https://instagram.com/' . Str::slug($attributes['name']),
                ],
            ];
        });
    }
} 
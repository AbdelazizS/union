<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Assuming you have authorization logic in your middleware
    }

    public function rules(): array
    {
        $service = $this->route('service');

        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique('services')->ignore($service?->id),
            ],
            'category_id' => ['required', 'exists:service_categories,id'],
            'description' => ['required', 'string', 'min:10'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'is_active' => ['boolean'],
            'image' => ['nullable', 'image', 'max:2048'], // 2MB max
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The service name is required.',
            'name.min' => 'The service name must be at least :min characters.',
            'name.unique' => 'This service name is already taken.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'The selected category is invalid.',
            'description.required' => 'The service description is required.',
            'description.min' => 'The description must be at least :min characters.',
            'base_price.required' => 'The base price is required.',
            'base_price.numeric' => 'The base price must be a number.',
            'base_price.min' => 'The base price must be at least :min.',
            'duration_minutes.required' => 'The duration is required.',
            'duration_minutes.integer' => 'The duration must be a whole number.',
            'duration_minutes.min' => 'The duration must be at least :min minute.',
            'features.*.string' => 'Features must be text.',
            'features.*.max' => 'Each feature cannot exceed :max characters.',
            'image.image' => 'The file must be an image.',
            'image.max' => 'The image size cannot exceed 2MB.',
        ];
    }
} 
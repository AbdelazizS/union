<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faq extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category',
        'question',
        'answer',
        'sort_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public static function getCategories()
    {
        return [
            'General' => 'General questions about our services',
            'Services' => 'Specific questions about cleaning services',
            'Booking' => 'How to book and scheduling information',
            'Payment' => 'Payment methods and pricing questions',
            'Cancellation' => 'Cancellation and refund policies'
        ];
    }
} 
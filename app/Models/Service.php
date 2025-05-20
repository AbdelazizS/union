<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Service extends Model
{
    use HasFactory;
    // use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'description',
        'base_price',
        'duration_minutes',
        'features',
        'is_active',
        'icon_path',
        'image_path',
        'full_description',
        'benefits',
        'faqs',
        'image'
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'duration_minutes' => 'integer',
        'features' => 'array',
        'is_active' => 'boolean',
        'benefits' => 'array',
        'faqs' => 'array'
    ];

    protected $appends = [
        'formatted_duration',
        'formatted_price',
        'icon_url',
        'image_url'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($service) {
            if (empty($service->slug)) {
                $service->slug = Str::slug($service->name);
            }
        });

        static::updating(function ($service) {
            if ($service->isDirty('name')) {
                $service->slug = Str::slug($service->name);
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function calculatePrice($hours)
    {
        $basePrice = $this->base_price;
        $categoryRate = $this->category->hourly_rate;
        
        // Use the higher of base price or category rate
        $hourlyRate = max($basePrice, $categoryRate);
        
        return $hourlyRate * $hours;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function getFormattedDurationAttribute()
    {
        $hours = floor($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;
        
        if ($hours > 0 && $minutes > 0) {
            return "{$hours}h {$minutes}m";
        } elseif ($hours > 0) {
            return "{$hours}h";
        } else {
            return "{$minutes}m";
        }
    }

    public function getFormattedPriceAttribute()
    {
        return number_format($this->base_price, 2);
    }

    public function getIconUrlAttribute()
    {
        if (!$this->icon_path) {
            return null;
        }
        
        if (filter_var($this->icon_path, FILTER_VALIDATE_URL)) {
            return $this->icon_path;
        }

        return asset('storage/' . $this->icon_path);
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        
        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }

        return asset('storage/' . $this->image);
    }
} 
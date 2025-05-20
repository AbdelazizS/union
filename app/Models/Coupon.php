<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class Coupon extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'type',
        'discount_value',
        'min_order_amount',
        'max_discount_amount',
        'usage_limit',
        'usage_count',
        'valid_from',
        'valid_until',
        'is_active',
        'applicable_categories',
        'applicable_services',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'usage_count' => 'integer',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'is_active' => 'boolean',
        'applicable_categories' => 'array',
        'applicable_services' => 'array',
    ];

    public function categories()
    {
        return $this->belongsToMany(ServiceCategory::class, 'coupon_service_category', 'coupon_id', 'category_id');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'coupon_service', 'coupon_id', 'service_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function isValid()
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();

        if ($this->valid_from && $now->lt($this->valid_from)) {
            return false;
        }

        if ($this->valid_until && $now->gt($this->valid_until)) {
            return false;
        }

        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    public function calculateDiscount($amount)
    {
        if (!$this->isValid()) {
            return 0;
        }

        if ($this->min_order_amount && $amount < $this->min_order_amount) {
            return 0;
        }

        $discount = $this->type === 'percentage' 
        ? $amount * ($this->discount_value / 100)
        : $this->discount_value;
        

        if ($this->max_discount_amount) {
            $discount = min($discount, $this->max_discount_amount);
        }

        return $discount;
    }

    public function canBeUsed()
    {
        return \DB::transaction(function () {
            // Reload the coupon to get fresh data
            $this->refresh();
            
            if (!$this->is_active) {
                return false;
            }

            $now = now();

            if ($this->valid_from && $now->lt($this->valid_from)) {
                return false;
            }

            if ($this->valid_until && $now->gt($this->valid_until)) {
                return false;
            }

            if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
                return false;
            }

            return true;
        });
    }

    public function incrementUsage()
    {
        return \DB::transaction(function () {
            // Reload the coupon to get fresh data
            $this->refresh();
            
            // Double check the usage limit
            if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
                throw new \Exception('Coupon usage limit has been reached.');
            }
            
            $this->increment('usage_count');
            
            // Verify the increment didn't exceed the limit
            if ($this->usage_limit && $this->usage_count > $this->usage_limit) {
                throw new \Exception('Coupon usage limit would be exceeded.');
            }
            
            return true;
        });
    }

    public function decrementUsage()
    {
        return \DB::transaction(function () {
            // Reload the coupon to get fresh data
            $this->refresh();
            
            // Ensure usage_count is greater than 0 before decrementing
            if ($this->usage_count <= 0) {
                \Log::warning("Attempted to decrement usage count when it's already 0 for coupon: {$this->code}");
                return false;
            }
            
            // Decrement usage count
            $this->decrement('usage_count');
            
            // Verify the decrement was successful
            $this->refresh();
            if ($this->usage_count < 0) {
                \Log::error("Negative usage count detected for coupon: {$this->code}");
                // Reset to 0 if somehow went negative
                $this->update(['usage_count' => 0]);
            }
            
            return true;
        });
    }

    public function recalculateUsageCount()
    {
        // Count only confirmed and completed bookings
        $actualUsage = $this->bookings()
            ->whereIn('status', ['confirmed', 'completed'])
            ->count();
        
        $this->update(['usage_count' => $actualUsage]);
        
        return $this;
    }
} 
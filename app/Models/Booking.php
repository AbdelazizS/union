<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory, SoftDeletes, Notifiable;

    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    protected $attributes = [
        'base_amount' => 0,
        'discount_amount' => 0,
        'frequency_discount' => 0,
        'bulk_discount' => 0,
        'coupon_discount' => 0,
        'special_period_adjustment' => 0,
        'final_amount' => 0,
        'frequency' => 'one_time',
        'status' => 'pending',
    ];

    protected $fillable = [
        'service_id',
        'coupon_id',
        'booking_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'booking_date',
        'booking_time',
        'duration_hours',
        'base_amount',
        'discount_amount',
        'frequency_discount',
        'bulk_discount',
        'coupon_discount',
        'special_period_adjustment',
        'final_amount',
        'status',
        'notes',
        'additional_services',
        'frequency',
    ];

    protected $casts = [
        'booking_date' => 'datetime',
        'duration_hours' => 'integer',
        'base_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'frequency_discount' => 'decimal:2',
        'bulk_discount' => 'decimal:2',
        'coupon_discount' => 'decimal:2',
        'special_period_adjustment' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'additional_services' => 'array',
        'frequency' => 'string',
    ];

    public function routeNotificationForMail()
    {
        return $this->customer_email;
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($booking) {
            if (empty($booking->booking_number)) {
                $booking->booking_number = 'BK-' . strtoupper(Str::random(8));
            }
        });
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function serviceOptions()
    {
        return $this->hasMany(BookingServiceOption::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function testimonial()
    {
        return $this->hasOne(Testimonial::class);
    }

    public function calculateFinalAmount()
    {
        $baseAmount = $this->service->calculatePrice($this->duration_hours);
        $this->base_amount = $baseAmount;

        $discountAmount = 0;
        if ($this->coupon) {
            $discountAmount = $this->coupon->calculateDiscount($baseAmount);
            $this->discount_amount = $discountAmount;
        }

        $this->final_amount = $baseAmount - $discountAmount;
        return $this->final_amount;
    }

    public function applyCoupon(Coupon $coupon)
    {
        if (!$coupon->isValid()) {
            return false;
        }

        $this->coupon_id = $coupon->id;
        $this->calculateFinalAmount();
        return true;
    }

    public function cancel()
    {
        $this->status = 'cancelled';
        $this->save();
    }

    public function complete()
    {
        $this->status = 'completed';
        $this->save();
    }

    public function calculatePricing()
    {
        $bookingService = new \App\Services\BookingService();
        $data = [
            'service_id' => $this->service_id,
            'booking_date' => $this->booking_date->format('Y-m-d'),
            'duration_hours' => $this->duration_hours,
            'frequency' => $this->frequency ?? 'one_time',
            'coupon_code' => null,
        ];
        
        if ($this->coupon && $this->coupon->isValid()) {
            $data['coupon_code'] = $this->coupon->code;
        } else {
            $this->coupon_id = null;
        }
        
        $priceBreakdown = $bookingService->calculatePricing($data);
        
        $this->base_amount = $priceBreakdown['base_amount'];
        $this->frequency_discount = $priceBreakdown['frequency_discount'];
        $this->bulk_discount = $priceBreakdown['bulk_discount'];
        $this->coupon_discount = $priceBreakdown['coupon_discount'];
        $this->special_period_adjustment = $priceBreakdown['special_period_adjustment'];
        
        $this->discount_amount = $this->frequency_discount + 
            $this->bulk_discount + 
            $this->coupon_discount;
        
        $this->final_amount = $priceBreakdown['final_amount'];

        return $this;
    }

    public function updateStatus($newStatus)
    {
        $oldStatus = $this->status;
        $this->status = $newStatus;
        $this->save();

        // Send status change notification
        $this->notify(new \App\Notifications\BookingStatusNotification($this, $oldStatus));

        // If status is completed, send feedback request after 24 hours
        if ($newStatus === 'completed') {
            \Illuminate\Support\Facades\Queue::later(
                now()->addHours(24),
                new \App\Jobs\SendFeedbackRequest($this)
            );
        }

        return $this;
    }

    public function sendReminder()
    {
        $this->notify(new \App\Notifications\BookingReminderNotification($this));
        return $this;
    }

    public function requestFeedback()
    {
        $this->notify(new \App\Notifications\ServiceFeedbackRequest($this));
        return $this;
    }
} 
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingServiceOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'service_option_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function serviceOption(): BelongsTo
    {
        return $this->belongsTo(ServiceOption::class, 'service_option_id');
    }
} 
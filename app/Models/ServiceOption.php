<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'label',
        'price',
        'min_qty',
        'max_qty',
        'is_variable',
        'note',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'min_qty' => 'integer',
        'max_qty' => 'integer',
        'is_variable' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function calculateTotalPrice($quantity)
    {
        if (!$this->is_variable) {
            return $this->price;
        }

        // Ensure quantity is within bounds
        $quantity = max($this->min_qty, min($quantity, $this->max_qty));
        return $this->price * $quantity;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
} 
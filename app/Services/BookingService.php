<?php

namespace App\Services;

use App\Models\Service;
use App\Models\Coupon;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class BookingService
{
    private $specialPeriods = [];

    public function __construct()
    {
        $this->loadSpecialPeriods();
    }

    private function loadSpecialPeriods()
    {
        // Cache special periods for 24 hours
        $this->specialPeriods = Cache::remember('booking_special_periods', 86400, function () {
            // This could be loaded from database or configuration
            return [
                'weekend' => [
                    'days' => [6, 7], // Saturday and Sunday
                    'surcharge' => 12.00
                ],
                'holiday' => [
                    'dates' => [
                        '12-25', // Christmas
                        '01-01', // New Year
                        // Add more holidays
                    ],
                    'surcharge' => 20.00
                ],
                'peak_hours' => [
                    'hours' => [9, 10, 11, 14, 15, 16], // Peak hours
                    'surcharge' => 5.00
                ]
            ];
        });
    }

    public function calculatePricing(array $data)
    {
        $baseAmount = $this->calculateBaseAmount($data);
      
        $frequencyDiscount = $this->calculateFrequencyDiscount($data, $baseAmount);
        $bulkDiscount = $this->calculateBulkDiscount($data, $baseAmount);
        $specialPeriodAdjustment = $this->calculateSpecialPeriodAdjustment($data);
        $couponDiscount = $this->calculateCouponDiscount($data, $baseAmount);

        $finalAmount = $baseAmount - $frequencyDiscount - $bulkDiscount - $couponDiscount + $specialPeriodAdjustment;

        return [
            'base_amount' => round($baseAmount, 2),
            'frequency_discount' => round($frequencyDiscount, 2),
            'bulk_discount' => round($bulkDiscount, 2),
            'special_period_adjustment' => round($specialPeriodAdjustment, 2),
            'coupon_discount' => round($couponDiscount, 2),
            'final_amount' => round(max(0, $finalAmount), 2),
        ];
    }

    private function calculateBaseAmount(array $data)
    {
        // Get the service's base rate per hour
        $service = Service::find($data['service_id']);

         // 1. Get the base price set for this specific service
        $basePrice = $service->base_price;
        // 2. Get the hourly rate from the service's category
        $categoryRate = $service->category->hourly_rate;
        
        // 3. Compare and take the higher rate between base_price and category hourly_rate
        $hourlyRate = max($basePrice, $categoryRate);
        return $hourlyRate * $data['duration_hours'];
    }

    private function calculateFrequencyDiscount(array $data, float $baseAmount)
    {
        return 0;
        $discountPercentages = [
            'weekly' => 0.15,    // 15% discount
            'biweekly' => 0.10,  // 10% discount
            'monthly' => 0.05,   // 5% discount
        ];

        return isset($discountPercentages[$data['frequency']]) 
            ? $baseAmount * $discountPercentages[$data['frequency']]
            : 0;
    }

    private function calculateBulkDiscount(array $data, float $baseAmount)
    {
        // if ($data['duration_hours'] >= 8) {
        //     return $baseAmount * 0.1; // 10% discount for 8+ hours
        // } elseif ($data['duration_hours'] >= 4) {
        //     return $baseAmount * 0.05; // 5% discount for 4-7 hours
        // }
        return 0;
    }

    private function calculateSpecialPeriodAdjustment(array $data)
    {
        // Example: Weekend surcharge
        // $bookingDate = new \DateTime($data['booking_date']);
        // $isWeekend = in_array($bookingDate->format('N'), [6, 7]); // 6 = Saturday, 7 = Sunday

        // return $isWeekend ? 12 : 0; // $12 surcharge for weekends
        return 0;
    }

    private function calculateCouponDiscount(array $data, float $baseAmount)
    {
        return 0;
        if (empty($data['coupon_code'])) {
            return 0;
        }

        $coupon = Coupon::where('code', $data['coupon_code'])
            ->where('is_active', true)
            ->first();

        if (!$coupon || !$coupon->isValid()) {
            return 0;
        }

        // // Check if the coupon is applicable to this service
        // if (!empty($coupon->applicable_services) && 
        //     !in_array($data['service_id'], $coupon->applicable_services)) {
        //     return 0;
        // }

        // // Check if the coupon is applicable to this service's category
        // $service = Service::find($data['service_id']);
        // if (!empty($coupon->applicable_categories) && 
        //     !in_array($service->category_id, $coupon->applicable_categories)) {
        //     return 0;
        // }

        // Check minimum order amount
        if ($coupon->min_order_amount && $baseAmount < $coupon->min_order_amount) {
            return 0;
        }

        // Calculate the discount
        $discount = $coupon->type === 'percentage'
            ? $baseAmount * ($coupon->discount_value / 100)
            : min($coupon->discount_value, $baseAmount);

        // Apply maximum discount limit if set
        if ($coupon->max_discount_amount) {
            $discount = min($discount, $coupon->max_discount_amount);
        }

        return $discount;
    }
} 
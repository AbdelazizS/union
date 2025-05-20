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
        try {
            $this->validateData($data);

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
                'breakdown' => [
                    'base_rate' => $this->getBaseRate($data),
                    'duration' => $data['duration_hours'],
                    'special_periods' => $this->getApplicableSpecialPeriods($data)
                ]
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error calculating pricing: ' . $e->getMessage());
        }
    }

    private function validateData(array $data)
    {
        $required = ['service_id', 'booking_date', 'duration_hours'];
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                throw new \Exception("Missing required field: {$field}");
            }
        }

        if (!is_numeric($data['duration_hours']) || $data['duration_hours'] <= 0) {
            throw new \Exception('Invalid duration hours');
        }

        try {
            new Carbon($data['booking_date']);
        } catch (\Exception $e) {
            throw new \Exception('Invalid booking date format');
        }
    }

    private function getBaseRate(array $data)
    {
        $service = Service::find($data['service_id']);
        if (!$service) {
            throw new \Exception('Service not found');
        }

        return max($service->base_price, $service->category->hourly_rate);
    }

    private function calculateBaseAmount(array $data)
    {
        return $this->getBaseRate($data) * $data['duration_hours'];
    }

    private function calculateFrequencyDiscount(array $data, float $baseAmount)
    {
        $discountPercentages = [
            'weekly' => 0.15,    // 15% discount
            'biweekly' => 0.10,  // 10% discount
            'monthly' => 0.05,   // 5% discount
        ];

        return isset($discountPercentages[$data['frequency'] ?? '']) 
            ? $baseAmount * $discountPercentages[$data['frequency']]
            : 0;
    }

    private function calculateBulkDiscount(array $data, float $baseAmount)
    {
        if ($data['duration_hours'] >= 8) {
            return $baseAmount * 0.1; // 10% discount for 8+ hours
        } elseif ($data['duration_hours'] >= 4) {
            return $baseAmount * 0.05; // 5% discount for 4-7 hours
        }
        return 0;
    }

    private function calculateSpecialPeriodAdjustment(array $data)
    {
        $bookingDate = new Carbon($data['booking_date']);
        $totalAdjustment = 0;

        // Check weekend surcharge
        if (in_array($bookingDate->format('N'), $this->specialPeriods['weekend']['days'])) {
            $totalAdjustment += $this->specialPeriods['weekend']['surcharge'];
        }

        // Check holiday surcharge
        if (in_array($bookingDate->format('m-d'), $this->specialPeriods['holiday']['dates'])) {
            $totalAdjustment += $this->specialPeriods['holiday']['surcharge'];
        }

        // Check peak hours surcharge
        if (in_array($bookingDate->format('G'), $this->specialPeriods['peak_hours']['hours'])) {
            $totalAdjustment += $this->specialPeriods['peak_hours']['surcharge'];
        }

        return $totalAdjustment;
    }

    private function getApplicableSpecialPeriods(array $data)
    {
        $bookingDate = new Carbon($data['booking_date']);
        $applicable = [];

        if (in_array($bookingDate->format('N'), $this->specialPeriods['weekend']['days'])) {
            $applicable[] = [
                'type' => 'weekend',
                'surcharge' => $this->specialPeriods['weekend']['surcharge']
            ];
        }

        if (in_array($bookingDate->format('m-d'), $this->specialPeriods['holiday']['dates'])) {
            $applicable[] = [
                'type' => 'holiday',
                'surcharge' => $this->specialPeriods['holiday']['surcharge']
            ];
        }

        if (in_array($bookingDate->format('G'), $this->specialPeriods['peak_hours']['hours'])) {
            $applicable[] = [
                'type' => 'peak_hours',
                'surcharge' => $this->specialPeriods['peak_hours']['surcharge']
            ];
        }

        return $applicable;
    }

    private function calculateCouponDiscount(array $data, float $baseAmount)
    {
        if (empty($data['coupon_code'])) {
            return 0;
        }

        $coupon = Coupon::where('code', $data['coupon_code'])
            ->where('is_active', true)
            ->first();

        if (!$coupon || !$coupon->isValid()) {
            return 0;
        }

        // Check if the coupon is applicable to this service
        if (!empty($coupon->applicable_services) && 
            !in_array($data['service_id'], $coupon->applicable_services)) {
            return 0;
        }

        // Check if the coupon is applicable to this service's category
        $service = Service::find($data['service_id']);
        if (!empty($coupon->applicable_categories) && 
            !in_array($service->category_id, $coupon->applicable_categories)) {
            return 0;
        }

        // Check minimum order amount
        if ($coupon->min_order_amount && $baseAmount < $coupon->min_order_amount) {
            return 0;
        }

        $discount = $coupon->type === 'percentage'
            ? $baseAmount * ($coupon->discount_value / 100)
            : $coupon->discount_value;

        // Apply maximum discount limit if set
        if ($coupon->max_discount_amount) {
            $discount = min($discount, $coupon->max_discount_amount);
        }

        return $discount;
    }
} 
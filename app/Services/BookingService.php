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
                    'selected_options' => $this->getSelectedOptionsBreakdown($data),
                    'special_periods' => $this->getApplicableSpecialPeriods($data)
                ]
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error calculating pricing: ' . $e->getMessage());
        }
    }

    private function validateData(array $data)
    {
        $required = ['service_id', 'booking_date', 'selected_options'];
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                throw new \Exception("Missing required field: {$field}");
            }
        }

        try {
            new Carbon($data['booking_date']);
        } catch (\Exception $e) {
            throw new \Exception('Invalid booking date format');
        }
    }

    private function calculateBaseAmount(array $data)
    {
        $service = Service::find($data['service_id']);
        if (!$service) {
            throw new \Exception('Service not found');
        }

        return $service->calculatePrice($data['selected_options']);
    }

    private function getSelectedOptionsBreakdown(array $data)
    {
        $service = Service::find($data['service_id']);
        if (!$service) {
            return [];
        }

        $breakdown = [];
        $quantity = $data['quantity'] ?? 1;

        foreach ($data['selected_options'] as $optionId) {
            $option = $service->options()->find($optionId);
            if ($option) {
                $optionQuantity = $option->is_variable ? $quantity : 1;
                $breakdown[] = [
                    'label' => $option->label,
                    'quantity' => $optionQuantity,
                    'price' => $option->price,
                    'total' => $option->is_variable 
                        ? $option->price * $optionQuantity 
                        : $option->price
                ];
            }
        }

        return $breakdown;
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
        // Calculate total quantity of all selected options
        $totalQuantity = array_sum($data['selected_options']);

        if ($totalQuantity >= 8) {
            return $baseAmount * 0.1; // 10% discount for 8+ items
        } elseif ($totalQuantity >= 4) {
            return $baseAmount * 0.05; // 5% discount for 4-7 items
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
<?php

namespace App\Console\Commands;

use App\Models\Coupon;
use Illuminate\Console\Command;

class FixCouponUsageCounts extends Command
{
    protected $signature = 'coupons:fix-usage';
    protected $description = 'Fix coupon usage counts based on actual confirmed and completed bookings';

    public function handle()
    {
        $coupons = Coupon::all();
        $fixed = 0;

        foreach ($coupons as $coupon) {
            $oldCount = $coupon->usage_count;
            $coupon->recalculateUsageCount();
            
            if ($oldCount !== $coupon->usage_count) {
                $this->info("Fixed coupon {$coupon->code}: {$oldCount} → {$coupon->usage_count}");
                $fixed++;
            }
        }

        $this->info("Fixed {$fixed} coupon(s) usage counts.");
    }
} 
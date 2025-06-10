<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function services(Request $request)
    {
        $dateRange = $this->getDateRange($request);
        
        $services = Service::withCount([
            'bookings as total_bookings_count' => function($query) use ($dateRange) {
                $query->whereBetween('booking_date', [$dateRange['start'], $dateRange['end']]);
            },
            'bookings as completed_bookings_count' => function($query) use ($dateRange) {
                $query->whereBetween('booking_date', [$dateRange['start'], $dateRange['end']])
                     ->where('status', 'completed');
            }
        ])
        ->withSum(['bookings' => function($query) use ($dateRange) {
            $query->whereBetween('booking_date', [$dateRange['start'], $dateRange['end']])
                  ->where('status', 'completed');
        }], 'final_amount')
        ->get()
        ->map(function($service) {
            $totalRevenue = $service->bookings_sum_final_amount ?? 0;
            $averageRevenue = $service->completed_bookings_count > 0 
                ? ($totalRevenue / $service->completed_bookings_count) 
                : 0;

            return [
                'id' => $service->id,
                'name' => $service->name,
                'category' => $service->category->name,
                'total_bookings' => $service->total_bookings_count,
                'completed_bookings' => $service->completed_bookings_count,
                'total_revenue' => number_format($totalRevenue, 2),
                'average_revenue' => number_format($averageRevenue, 2),
                'completion_rate' => $service->total_bookings_count > 0 
                    ? number_format(($service->completed_bookings_count / $service->total_bookings_count) * 100, 1) . '%'
                    : '0%'
            ];
        });

        return Inertia::render('Admin/Reports/Services', [
            'services' => $services,
            'dateRange' => $dateRange,
        ]);
    }

    public function bookings(Request $request)
    {
        $dateRange = $this->getDateRange($request);

        $bookingStats = Booking::whereBetween('booking_date', [$dateRange['start'], $dateRange['end']])
            ->select(
                DB::raw('COUNT(*) as total_bookings'),
                DB::raw('COUNT(CASE WHEN status = "completed" THEN 1 END) as completed_bookings'),
                DB::raw('COUNT(CASE WHEN status = "cancelled" THEN 1 END) as cancelled_bookings'),
                // DB::raw('AVG(duration_hours) as avg_duration'),
                DB::raw('SUM(CASE WHEN status = "completed" THEN final_amount ELSE 0 END) as total_revenue'),
                DB::raw('AVG(CASE WHEN status = "completed" THEN final_amount END) as avg_revenue'),
                DB::raw('SUM(CASE WHEN status = "completed" THEN discount_amount ELSE 0 END) as total_discounts'),
                DB::raw('COUNT(DISTINCT service_id) as unique_services')
            )
            ->first();

        $bookingsByDate = Booking::whereBetween('booking_date', [$dateRange['start'], $dateRange['end']])
            ->select(
                DB::raw('DATE(booking_date) as date'),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN status = "completed" THEN final_amount ELSE 0 END) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $popularServices = Booking::whereBetween('booking_date', [$dateRange['start'], $dateRange['end']])
            ->select('service_id', DB::raw('COUNT(*) as total'))
            ->with('service:id,name')
            ->groupBy('service_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Reports/Bookings', [
            'stats' => $bookingStats,
            'bookingsByDate' => $bookingsByDate,
            'popularServices' => $popularServices,
            'dateRange' => $dateRange,
        ]);
    }

    public function financial(Request $request)
    {
        $dateRange = $this->getDateRange($request);

        $revenueStats = Booking::whereBetween('booking_date', [$dateRange['start'], $dateRange['end']])
            ->where('status', 'completed')
            ->select(
                DB::raw('SUM(base_amount) as total_base_amount'),
                DB::raw('SUM(frequency_discount) as total_frequency_discounts'),
                DB::raw('SUM(bulk_discount) as total_bulk_discounts'),
                DB::raw('SUM(coupon_discount) as total_coupon_discounts'),
                DB::raw('SUM(special_period_adjustment) as total_adjustments'),
                DB::raw('SUM(final_amount) as total_revenue')
            )
            ->first();

        // Calculate total discounts as sum of all discount types
        $revenueStats->total_discounts = round(
            ($revenueStats->total_frequency_discounts ?? 0) + 
            ($revenueStats->total_bulk_discounts ?? 0) + 
            ($revenueStats->total_coupon_discounts ?? 0),
            2
        );

        // Ensure all discount values are rounded to 2 decimal places
        $revenueStats->total_frequency_discounts = round($revenueStats->total_frequency_discounts ?? 0, 2);
        $revenueStats->total_bulk_discounts = round($revenueStats->total_bulk_discounts ?? 0, 2);
        $revenueStats->total_coupon_discounts = round($revenueStats->total_coupon_discounts ?? 0, 2);

        $revenueByDay = Booking::whereBetween('booking_date', [$dateRange['start'], $dateRange['end']])
            ->where('status', 'completed')
            ->select(
                DB::raw('DATE(booking_date) as date'),
                DB::raw('SUM(base_amount) as base_amount'),
                DB::raw('SUM(frequency_discount) as frequency_discounts'),
                DB::raw('SUM(bulk_discount) as bulk_discounts'),
                DB::raw('SUM(coupon_discount) as coupon_discounts'),
                DB::raw('SUM(final_amount) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($day) {
                $day->total_discounts = round(
                    ($day->frequency_discounts ?? 0) + 
                    ($day->bulk_discounts ?? 0) + 
                    ($day->coupon_discounts ?? 0),
                    2
                );
                return $day;
            });

        $discountBreakdown = [
            [
                'type' => 'Frequency Discounts',
                'amount' => $revenueStats->total_frequency_discounts,
                'percentage' => $revenueStats->total_discounts > 0 
                    ? round(($revenueStats->total_frequency_discounts / $revenueStats->total_discounts) * 100, 1)
                    : 0
            ],
            [
                'type' => 'Bulk Discounts (33.33% Quantity)',
                'amount' => $revenueStats->total_bulk_discounts,
                'percentage' => $revenueStats->total_discounts > 0 
                    ? round(($revenueStats->total_bulk_discounts / $revenueStats->total_discounts) * 100, 1)
                    : 0
            ],
            [
                'type' => 'Coupon Discounts',
                'amount' => $revenueStats->total_coupon_discounts,
                'percentage' => $revenueStats->total_discounts > 0 
                    ? round(($revenueStats->total_coupon_discounts / $revenueStats->total_discounts) * 100, 1)
                    : 0
            ],
        ];

        return Inertia::render('Admin/Reports/Financial', [
            'stats' => $revenueStats,
            'revenueByDay' => $revenueByDay,
            'discountBreakdown' => $discountBreakdown,
            'dateRange' => $dateRange,
        ]);
    }

    private function getDateRange(Request $request)
    {
        $start = $request->input('start_date') 
            ? Carbon::parse($request->input('start_date')) 
            : Carbon::now()->startOfMonth();
            
        $end = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now()->endOfMonth();

        return [
            'start' => $start->startOfDay(),
            'end' => $end->endOfDay(),
        ];
    }
} 
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Coupon;
use App\Models\Partner;
use App\Models\Testimonial;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $today = $now->copy()->startOfDay();
        $yesterday = $now->copy()->subDay()->startOfDay();
        $weekStart = $now->copy()->startOfWeek();
        $monthStart = $now->copy()->startOfMonth();

        // Calculate main statistics
        $totalBookings = Booking::count();
        $todayBookings = Booking::whereDate('created_at', $today)->count();
        $yesterdayBookings = Booking::whereDate('created_at', $yesterday)->count();
        
        // Calculate booking growth (daily)
        $bookingsGrowth = $yesterdayBookings > 0 
            ? (($todayBookings - $yesterdayBookings) / $yesterdayBookings) * 100 
            : ($todayBookings > 0 ? 'new' : 0);

        // Revenue statistics
        $todayRevenue = Booking::whereDate('created_at', $today)
            ->where('status', 'completed')
            ->sum('final_amount');
        
        $yesterdayRevenue = Booking::whereDate('created_at', $yesterday)
            ->where('status', 'completed')
            ->sum('final_amount');
        
        $revenueGrowth = $yesterdayRevenue > 0 
            ? (($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100 
            : ($todayRevenue > 0 ? 'new' : 0);

        // Weekly revenue chart data
        $weeklyRevenue = collect(CarbonPeriod::create($weekStart, $now))
            ->map(function ($date) {
                $revenue = Booking::whereDate('created_at', $date)
                    ->where('status', '!=', 'cancelled')
                    ->sum('final_amount');
                return [
                    'date' => $date->format('D'),
                    'revenue' => round($revenue, 2),
                    'bookings' => Booking::whereDate('created_at', $date)->count(),
                ];
            });

        // Monthly booking status distribution
        $monthlyStatusDistribution = Booking::whereBetween('created_at', [$monthStart, $now])
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->status => $item->count]);

        // Service category distribution
        $categoryDistribution = ServiceCategory::withCount(['services' => function ($query) {
                $query->where('is_active', true);
            }])
            ->where('is_active', true)
            ->get()
            ->map(fn ($category) => [
                'name' => $category->name,
                'value' => $category->services_count,
            ]);

        // Popular services
        $popularServices = Service::withCount(['bookings' => function ($query) use ($monthStart) {
                $query->where('created_at', '>=', $monthStart);
            }])
            ->where('is_active', true)
            ->orderByDesc('bookings_count')
            ->take(5)
            ->get()
            ->map(fn ($service) => [
                'name' => $service->name,
                'bookings' => $service->bookings_count,
            ]);

        // Customer satisfaction trend
        $satisfactionTrend = collect(CarbonPeriod::create($weekStart, $now))
            ->map(function ($date) {
                $avgRating = Testimonial::whereDate('created_at', $date)
                    ->avg('rating') ?? 0;
                return [
                    'date' => $date->format('D'),
                    'rating' => round($avgRating, 1),
                ];
            });

        // Service statistics
        $activeServices = Service::where('is_active', true)->count();
        $totalCategories = ServiceCategory::where('is_active', true)->count();

        // Customer satisfaction statistics
        $averageRating = Testimonial::avg('rating') ?? 0;
        $totalReviews = Testimonial::count();

        // Today's bookings
        $pendingToday = Booking::whereDate('created_at', $today)
            ->where('status', 'pending')
            ->count();

        // Coupon statistics
        $activeCoupons = Coupon::where('is_active', true)
            ->where(function($query) use ($now) {
                $query->whereNull('valid_until')
                    ->orWhere('valid_until', '>', $now);
            })
            ->count();
        
        $totalCouponUses = Booking::whereNotNull('coupon_id')->count();
        $couponUsage = $totalBookings > 0 ? ($totalCouponUses / $totalBookings) * 100 : 0;

        // Partner statistics
        $activePartners = Partner::where('is_active', true)->count();

        // Completion rate statistics
        $completedBookings = Booking::where('status', 'completed')->count();
        $completionRate = $totalBookings > 0 ? ($completedBookings / $totalBookings) * 100 : 0;
        
        // Recent bookings
        $recentBookings = Booking::with('service')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'customer_name' => $booking->customer_name,
                    'service' => [
                        'name' => $booking->service->name
                    ],
                    'final_amount' => number_format($booking->final_amount, 2),
                    'status' => $booking->status,
                    'created_at' => $booking->created_at->format('Y-m-d H:i:s')
                ];
            });

        // Time context
        $firstBookingDate = Booking::oldest()->first()?->created_at;
        $bookingTimeContext = $firstBookingDate 
            ? 'Since ' . $firstBookingDate->format('M Y')
            : 'No bookings yet';

        // Compile all statistics
        $stats = [
            'totalBookings' => $totalBookings,
            'bookingsGrowth' => $bookingsGrowth,
            'bookingTimeContext' => $bookingTimeContext,
            'todayRevenue' => round($todayRevenue, 2),
            'revenueGrowth' => $revenueGrowth,
            'activeServices' => $activeServices,
            'totalCategories' => $totalCategories,
            'averageRating' => round($averageRating, 1),
            'totalReviews' => $totalReviews,
            'todayBookings' => $todayBookings,
            'pendingToday' => $pendingToday,
            'activeCoupons' => $activeCoupons,
            'couponUsage' => round($couponUsage, 1),
            'activePartners' => $activePartners,
            'completionRate' => round($completionRate, 1),
        ];

        // Charts data
        $charts = [
            'weeklyRevenue' => $weeklyRevenue,
            'statusDistribution' => $monthlyStatusDistribution,
            'categoryDistribution' => $categoryDistribution,
            'popularServices' => $popularServices,
            'satisfactionTrend' => $satisfactionTrend,
        ];

        return Inertia::render('Admin/Index', [
            'stats' => $stats,
            'charts' => $charts,
            'recentBookings' => $recentBookings,
        ]);
    }
}

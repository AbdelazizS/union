import AdminLayout from '../layouts/AdminLayout.jsx';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Users,
    Calendar,
    PoundSterling,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Plus,
    Settings,
    FileText,
    Star,
    Package,
    Percent,
    Handshake
} from "lucide-react";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// Modern color palette for charts
const CHART_COLORS = {
    primary: "#2563eb",
    secondary: "#7c3aed",
    success: "#059669",
    warning: "#d97706",
    danger: "#dc2626",
    info: "#0891b2"
};

const PIE_COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.danger
];

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border">
                <p className="text-sm font-medium mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-muted-foreground">{entry.name}:</span>
                        <span className="font-medium">
                            {entry.name.toLowerCase().includes('revenue') ? '£' : ''}
                            {typeof entry.value === 'number'
                                ? entry.value.toLocaleString()
                                : entry.value}
                        </span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Dashboard({
    stats = {},
    charts = {
        weeklyRevenue: [],
        statusDistribution: {},
        categoryDistribution: [],
        popularServices: [],
        satisfactionTrend: []
    },
    recentBookings = []
}) {
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = async () => {
        try {
            setIsLoading(true);
            await router.reload({ only: ['stats', 'charts', 'recentBookings'] });
            toast.success('Dashboard data refreshed');
        } catch (error) {
            toast.error('Failed to refresh data');
        } finally {
            setIsLoading(false);
        }
    };

    const MetricCard = ({ title, value, icon: Icon, growth, subtitle }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {typeof value === 'number' && title.toLowerCase().includes('revenue')
                        ? `£${value.toLocaleString()}`
                        : value}
                </div>
                {growth !== undefined && (
                    <p className="text-xs text-muted-foreground flex items-center">
                        {growth === 'new' ? (
                            <>
                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                New today
                            </>
                        ) : (
                            <>
                                {Number(growth) >= 0 ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                                )}
                                {Math.abs(Number(growth)).toFixed(1)}% vs yesterday
                            </>
                        )}
                    </p>
                )}
                {subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );

    const QuickActionCard = ({ title, description, icon: Icon, href, color = "primary" }) => (
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.visit(href)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 text-${color}`} />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800"
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold leading-tight text-gray-800">
                        Dashboard Overview
                    </h2>
                    <Button
                        onClick={refreshData}
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Refresh
                    </Button>
                </div>

                <div className="space-y-8">
                    {/* Main KPI Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            title="Total Bookings"
                            value={stats.totalBookings ?? 0}
                            icon={Calendar}
                            growth={stats.bookingsGrowth}
                            subtitle={stats.bookingTimeContext}
                        />
                        <MetricCard
                            title="Today's Revenue"
                            value={stats.todayRevenue ?? 0}
                            icon={PoundSterling}
                            growth={stats.revenueGrowth}
                            subtitle="vs yesterday"
                        />
                        <MetricCard
                            title="Active Services"
                            value={stats.activeServices ?? 0}
                            icon={Package}
                            subtitle={`${stats.totalCategories ?? 0} categories`}
                        />
                        <MetricCard
                            title="Customer Rating"
                            value={`${stats.averageRating ?? 0}/5`}
                            icon={Star}
                            subtitle={`${stats.totalReviews ?? 0} reviews`}
                        />
                    </div>

                    {/* Secondary KPI Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            title="Today's Bookings"
                            value={stats.todayBookings ?? 0}
                            icon={Clock}
                            subtitle={`${stats.pendingToday ?? 0} pending`}
                        />
                        <MetricCard
                            title="Active Coupons"
                            value={stats.activeCoupons ?? 0}
                            icon={Percent}
                            subtitle={`${stats.couponUsage ?? 0}% usage rate`}
                        />
                        <MetricCard
                            title="Partners"
                            value={stats.activePartners ?? 0}
                            icon={Handshake}
                            subtitle="Active partnerships"
                        />
                        <MetricCard
                            title="Completion Rate"
                            value={`${stats.completionRate ?? 0}%`}
                            icon={CheckCircle2}
                            growth={stats.completionRateGrowth}
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Weekly Revenue & Bookings Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Weekly Revenue & Bookings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={charts.weeklyRevenue ?? []}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                                                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.1} />
                                                <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke={CHART_COLORS.primary}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            yAxisId="left"
                                            name="Revenue"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="bookings"
                                            stroke={CHART_COLORS.secondary}
                                            fillOpacity={1}
                                            fill="url(#colorBookings)"
                                            yAxisId="right"
                                            name="Bookings"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Monthly Booking Status Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Package className="h-5 w-5 text-primary" />
                                    Booking Status Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={Object.entries(charts.statusDistribution ?? {}).map(([status, count]) => ({
                                                name: status.charAt(0).toUpperCase() + status.slice(1),
                                                value: count
                                            }))}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {Object.entries(charts.statusDistribution ?? {}).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Service Category Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Package className="h-5 w-5 text-primary" />
                                    Service Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={(charts.categoryDistribution ?? []).map(category => ({
                                                ...category,
                                                value: category.value || 0.1 // Use 0.1 for zero values to make them visible
                                            }))}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, value, percent }) => {
                                                // Show 0% for values that were originally 0
                                                const displayPercent = value === 0.1 ? 0 : (percent * 100).toFixed(0);
                                                return `${name} (${displayPercent}%)`;
                                            }}
                                            labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 0.5 }}
                                        >
                                            {(charts.categoryDistribution ?? []).map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                                                    fillOpacity={entry.value === 0 ? 0.5 : 1} // Reduce opacity for zero values
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 rounded-lg shadow-lg border">
                                                            <p className="text-sm font-medium">{data.name}</p>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                Services: {data.originalValue || 0}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Percentage: {data.value === 0.1 ? '0' : (payload[0].percent * 100).toFixed(0)}%
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend
                                            formatter={(value, entry) => {
                                                const { payload } = entry;
                                                const percent = payload.value === 0.1 ? 0 : (payload.percent * 100).toFixed(0);
                                                return `${value} (${percent}%)`;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Popular Services */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Star className="h-5 w-5 text-primary" />
                                    Popular Services
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={(charts.popularServices ?? [])
                                            .sort((a, b) => b.bookings - a.bookings)
                                            .slice(0, 5)
                                        }
                                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            interval={0}
                                            tick={{
                                                angle: -45,
                                                textAnchor: 'end',
                                                fontSize: 12,
                                                fill: 'hsl(var(--muted-foreground))'
                                            }}
                                        />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="bookings"
                                            name="Bookings"
                                            radius={[4, 4, 0, 0]}
                                        >
                                            {(charts.popularServices ?? [])
                                                .sort((a, b) => b.bookings - a.bookings)
                                                .slice(0, 5)
                                                .map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                                                    />
                                                ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Customer Satisfaction Trend */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Star className="h-5 w-5 text-primary" />
                                    Customer Satisfaction Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={charts.satisfactionTrend ?? []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 5]} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="rating"
                                            stroke={CHART_COLORS.primary}
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            name="Rating"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <QuickActionCard
                            title="New Booking"
                            description="Create a new service booking"
                            icon={Plus}
                            href={route('admin.bookings.create')}
                            color="primary"
                        />
                        <QuickActionCard
                            title="Manage Categories"
                            description="View and manage service categories"
                            icon={Package}
                            href={route('admin.service-categories.index')}
                            color="primary"
                        />
                        <QuickActionCard
                            title="Manage Services"
                            description="View and manage all services"
                            icon={FileText}
                            href={route('admin.services.index')}
                            color="primary"
                        />
                        <QuickActionCard
                            title="Manage Bookings"
                            description="View all bookings"
                            icon={Calendar}
                            href={route('admin.bookings.index')}
                            color="primary"
                        />
                    </div>

                    {/* Recent Bookings Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Recent Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(recentBookings ?? []).map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell>#{booking.id}</TableCell>
                                            <TableCell>{booking.customer_name}</TableCell>
                                            <TableCell>{booking.service.name}</TableCell>
                                            <TableCell>£{booking.final_amount}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={booking.status} />
                                            </TableCell>
                                            <TableCell>{booking.created_at}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

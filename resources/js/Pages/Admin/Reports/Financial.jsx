import { useState } from "react";
import AdminLayout from '../../../layouts/AdminLayout.jsx';
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DateRangePicker } from "@/Components/ui/date-range-picker";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  CreditCard, 
  Percent, 
  Settings2 
} from "lucide-react";

// Modern enterprise color palette
const CHART_COLORS = {
  primary: "#2563eb", // Primary blue
  secondary: "#7c3aed", // Purple
  success: "#059669", // Green
  warning: "#d97706", // Amber
  accent1: "#3b82f6", // Light blue
  accent2: "#8b5cf6", // Light purple
  accent3: "#10b981", // Emerald
};

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.success];

export default function Financial({ stats, revenueByDay, discountBreakdown, dateRange }) {
  const [date, setDate] = useState([
    new Date(dateRange.start),
    new Date(dateRange.end),
  ]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    window.location.href = route('admin.reports.financial', {
      start_date: format(newDate[0], 'yyyy-MM-dd'),
      end_date: format(newDate[1], 'yyyy-MM-dd'),
    });
  };

  const chartData = revenueByDay.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    revenue: parseFloat(item.revenue),
    discounts: parseFloat(item.discounts)
  }));

  // Calculate growth metrics
  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = calculateGrowth(
    chartData[chartData.length - 1]?.revenue,
    chartData[chartData.length - 2]?.revenue
  );

  // Custom tooltip styles
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="flex items-center gap-2">
              <span className="font-medium">{entry.name}:</span>
              <span>£{entry.value.toFixed(2)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <Head title="Financial Report" />

      <div className="container mx-auto py-6 space-y-6 px-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Financial Report</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Analytics for {format(date[0], 'MMM dd, yyyy')} - {format(date[1], 'MMM dd, yyyy')}
            </p>
          </div>
          {/* <DateRangePicker date={date} onDateChange={handleDateChange} /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <CardTitle>Total Revenue</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">
                £{typeof stats.total_revenue === 'number'
                    ? stats.total_revenue.toFixed(2)
                    : typeof stats.total_revenue === 'string'
                      ? parseFloat(stats.total_revenue).toFixed(2)
                      : '0.00'
                  }
                </p>
                {revenueGrowth !== 0 && (
                  <span className={`flex items-center text-sm ${revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {revenueGrowth > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Before discounts: £{typeof stats.total_base_amount === 'number'
                  ? stats.total_base_amount.toFixed(2)
                  : typeof stats.total_base_amount === 'string'
                    ? parseFloat(stats.total_base_amount).toFixed(2)
                    : '0.00'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-purple-500" />
                <CardTitle>Total Discounts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
              £{typeof stats.total_discounts === 'number'
                  ? stats.total_discounts.toFixed(2)
                  : typeof stats.total_discounts === 'string'
                    ? parseFloat(stats.total_discounts).toFixed(2)
                    : '0.00'
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {(() => {
                  const discounts = typeof stats.total_discounts === 'number'
                    ? stats.total_discounts
                    : typeof stats.total_discounts === 'string'
                      ? parseFloat(stats.total_discounts)
                      : 0;
                  const baseAmount = typeof stats.total_base_amount === 'number'
                    ? stats.total_base_amount
                    : typeof stats.total_base_amount === 'string'
                      ? parseFloat(stats.total_base_amount)
                      : 0;
                  return baseAmount > 0 ? ((discounts / baseAmount) * 100).toFixed(1) : '0';
                })()}% of base amount
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-green-500" />
                <CardTitle>Special Adjustments</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
              £{typeof stats.total_adjustments === 'number'
                  ? stats.total_adjustments.toFixed(2)
                  : typeof stats.total_adjustments === 'string'
                    ? parseFloat(stats.total_adjustments).toFixed(2)
                    : '0.00'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <CardTitle>Revenue Analytics</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="discountGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280' }}
                    tickFormatter={(value) => `£${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={CHART_COLORS.primary}
                    fill="url(#revenueGradient)"
                    name="Revenue"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="discounts"
                    stroke={CHART_COLORS.secondary}
                    fill="url(#discountGradient)"
                    name="Discounts"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-purple-500" />
                <CardTitle>Discount Breakdown</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Frequency Discounts",
                        value: typeof stats.total_frequency_discounts === 'number' 
                          ? stats.total_frequency_discounts 
                          : typeof stats.total_frequency_discounts === 'string' 
                            ? parseFloat(stats.total_frequency_discounts || 0) 
                            : 0
                      },
                      {
                        name: "Bulk Discounts",
                        value: typeof stats.total_bulk_discounts === 'number'
                          ? stats.total_bulk_discounts
                          : typeof stats.total_bulk_discounts === 'string'
                            ? parseFloat(stats.total_bulk_discounts || 0)
                            : 0
                      },
                      {
                        name: "Coupon Discounts",
                        value: typeof stats.total_coupon_discounts === 'number'
                          ? stats.total_coupon_discounts
                          : typeof stats.total_coupon_discounts === 'string'
                            ? parseFloat(stats.total_coupon_discounts || 0)
                            : 0
                      }
                    ].filter(item => item.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value, percent }) => 
                      `${name} (${(percent * 100).toFixed(1)}%)`
                    }
                  >
                    {PIE_COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `£${parseFloat(value).toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-purple-500" />
              <CardTitle>Discount Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  Frequency Discounts
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                £{typeof stats.total_frequency_discounts === 'number'
                    ? stats.total_frequency_discounts.toFixed(2)
                    : typeof stats.total_frequency_discounts === 'string'
                      ? parseFloat(stats.total_frequency_discounts).toFixed(2)
                      : '0.00'
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {(() => {
                    const freqDiscounts = typeof stats.total_frequency_discounts === 'number'
                      ? stats.total_frequency_discounts
                      : typeof stats.total_frequency_discounts === 'string'
                        ? parseFloat(stats.total_frequency_discounts)
                        : 0;
                    const totalDiscounts = typeof stats.total_discounts === 'number'
                      ? stats.total_discounts
                      : typeof stats.total_discounts === 'string'
                        ? parseFloat(stats.total_discounts)
                        : 0;
                    return totalDiscounts > 0 ? ((freqDiscounts / totalDiscounts) * 100).toFixed(1) : '0';
                  })()}% of total discounts
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  Bulk Discounts
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                £{typeof stats.total_bulk_discounts === 'number'
                    ? stats.total_bulk_discounts.toFixed(2)
                    : typeof stats.total_bulk_discounts === 'string'
                      ? parseFloat(stats.total_bulk_discounts).toFixed(2)
                      : '0.00'
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {(() => {
                    const bulkDiscounts = typeof stats.total_bulk_discounts === 'number'
                      ? stats.total_bulk_discounts
                      : typeof stats.total_bulk_discounts === 'string'
                        ? parseFloat(stats.total_bulk_discounts)
                        : 0;
                    const totalDiscounts = typeof stats.total_discounts === 'number'
                      ? stats.total_discounts
                      : typeof stats.total_discounts === 'string'
                        ? parseFloat(stats.total_discounts)
                        : 0;
                    return totalDiscounts > 0 ? ((bulkDiscounts / totalDiscounts) * 100).toFixed(1) : '0';
                  })()}% of total discounts
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  Coupon Discounts
                </h3>
                <p className="text-2xl font-bold text-green-600">
                £{typeof stats.total_coupon_discounts === 'number'
                    ? stats.total_coupon_discounts.toFixed(2)
                    : typeof stats.total_coupon_discounts === 'string'
                      ? parseFloat(stats.total_coupon_discounts).toFixed(2)
                      : '0.00'
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {(() => {
                    const couponDiscounts = typeof stats.total_coupon_discounts === 'number'
                      ? stats.total_coupon_discounts
                      : typeof stats.total_coupon_discounts === 'string'
                        ? parseFloat(stats.total_coupon_discounts)
                        : 0;
                    const totalDiscounts = typeof stats.total_discounts === 'number'
                      ? stats.total_discounts
                      : typeof stats.total_discounts === 'string'
                        ? parseFloat(stats.total_discounts)
                        : 0;
                    return totalDiscounts > 0 ? ((couponDiscounts / totalDiscounts) * 100).toFixed(1) : '0';
                  })()}% of total discounts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 
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
  Area,
  AreaChart,
} from "recharts";
import { Badge } from "@/Components/ui/badge";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  BarChart3Icon,
  TagIcon,
  LayersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/Components/ui/progress";

// Custom tooltip styles
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="text-sm font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm">
              {entry.name}: {entry.value}
              {entry.name === "Revenue" ? "£" : ""}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Bookings({ stats, bookingsByDate, popularServices, dateRange }) {
  const [date, setDate] = useState([
    new Date(dateRange.start),
    new Date(dateRange.end),
  ]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    window.location.href = route('admin.reports.bookings', {
      start_date: format(newDate[0], 'yyyy-MM-dd'),
      end_date: format(newDate[1], 'yyyy-MM-dd'),
    });
  };

  const chartData = bookingsByDate.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    bookings: item.total,
    revenue: parseFloat(item.revenue)
  }));

  return (
    <AdminLayout>
      <Head title="Bookings Report" />

      <div className="container mx-auto py-6 space-y-6 px-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Bookings Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Detailed insights and metrics for your booking performance
            </p>
          </div>
          <DateRangePicker date={date} onDateChange={handleDateChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-primary/5 transform rotate-45" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Total Bookings</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight">{stats.total_bookings}</span>
                  <span className="text-sm text-muted-foreground">this week</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Daily Avg</p>
                    <p className="text-sm font-medium">{(stats.total_bookings / 7).toFixed(1)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Target Achievement</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{((stats.total_bookings / 15) * 100).toFixed()}%</p>
                      {stats.total_bookings >= 15 ? (
                        <Badge variant="success" className="bg-green-100 text-green-800">
                          Exceeded
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="bg-yellow-100 text-yellow-800">
                          In Progress
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Progress to Target (15)</span>
                    <span className="font-medium">{stats.total_bookings}/15</span>
                  </div>
                  <Progress 
                    value={(stats.total_bookings / 15) * 100}
                    className="h-2"
                    indicatorClassName={cn(
                      stats.total_bookings >= 15 ? "bg-green-500" : "bg-primary"
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-primary/5 transform rotate-45" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Completed Bookings</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight">{stats.completed_bookings}</span>
                  <span className="text-sm text-muted-foreground">of {stats.total_bookings}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">
                      {stats.total_bookings > 0 
                        ? ((stats.completed_bookings / stats.total_bookings) * 100).toFixed()
                        : '0'}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/30 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats.total_bookings > 0 
                          ? (stats.completed_bookings / stats.total_bookings) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-primary/5 transform rotate-45" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Average Duration</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {typeof stats.avg_duration === 'number' 
                      ? stats.avg_duration.toFixed(1)
                      : typeof stats.avg_duration === 'string'
                        ? parseFloat(stats.avg_duration).toFixed(1)
                        : '0'}
                  </span>
                  <span className="text-sm text-muted-foreground">hours</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Min Time</p>
                    <p className="text-sm font-medium">1.0h</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Max Time</p>
                    <p className="text-sm font-medium">8.0h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-primary/5 transform rotate-45" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Total Revenue</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight">
                  £{typeof stats.total_revenue === 'number' 
                      ? stats.total_revenue.toFixed(2)
                      : typeof stats.total_revenue === 'string'
                        ? parseFloat(stats.total_revenue).toFixed(2)
                        : '0.00'
                    }
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Per Booking</p>
                    <p className="text-sm font-medium">
                    £{typeof stats.avg_revenue === 'number'
                        ? stats.avg_revenue.toFixed(2)
                        : typeof stats.avg_revenue === 'string'
                          ? parseFloat(stats.avg_revenue).toFixed(2)
                          : '0.00'
                      }
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">This Week</p>
                    <p className="text-sm font-medium">+{stats.total_revenue}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-primary" />
                Bookings & Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--foreground))' }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--foreground))' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="bookings"
                    stroke="hsl(var(--primary))"
                    fill="url(#bookingsGradient)"
                    name="Bookings"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#82ca9d"
                    fill="url(#revenueGradient)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LayersIcon className="h-5 w-5 text-primary" />
                Popular Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {popularServices.map((service) => (
                  <div key={service.service_id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">
                          {service.service.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {service.total} bookings
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-mono">
                        {((service.total / stats.total_bookings) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress
                      value={(service.total / stats.total_bookings) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-primary" />
                Discount Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Total Discounts</p>
                    <p className="text-2xl font-bold text-primary">
                    £{typeof stats.total_discounts === 'number'
                        ? stats.total_discounts.toFixed(2)
                        : typeof stats.total_discounts === 'string'
                          ? parseFloat(stats.total_discounts).toFixed(2)
                          : '0.00'
                      }
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Avg Discount/Booking</p>
                    <p className="text-2xl font-bold text-primary">
                    £{stats.total_bookings > 0
                        ? ((typeof stats.total_discounts === 'number'
                            ? stats.total_discounts
                            : typeof stats.total_discounts === 'string'
                              ? parseFloat(stats.total_discounts)
                              : 0) / stats.total_bookings).toFixed(2)
                        : '0.00'
                      }
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Discount Rate</span>
                    <Badge variant="outline" className="font-mono">
                      {(() => {
                        const totalDiscounts = typeof stats.total_discounts === 'number'
                          ? stats.total_discounts
                          : typeof stats.total_discounts === 'string'
                            ? parseFloat(stats.total_discounts)
                            : 0;
                        const totalRevenue = typeof stats.total_revenue === 'number'
                          ? stats.total_revenue
                          : typeof stats.total_revenue === 'string'
                            ? parseFloat(stats.total_revenue)
                            : 0;
                        const total = totalRevenue + totalDiscounts;
                        return total > 0 ? ((totalDiscounts / total) * 100).toFixed(1) : '0';
                      })()}%
                    </Badge>
                  </div>
                  <Progress
                    value={(() => {
                      const totalDiscounts = typeof stats.total_discounts === 'number'
                        ? stats.total_discounts
                        : typeof stats.total_discounts === 'string'
                          ? parseFloat(stats.total_discounts)
                          : 0;
                      const totalRevenue = typeof stats.total_revenue === 'number'
                        ? stats.total_revenue
                        : typeof stats.total_revenue === 'string'
                          ? parseFloat(stats.total_revenue)
                          : 0;
                      const total = totalRevenue + totalDiscounts;
                      return total > 0 ? (totalDiscounts / total) * 100 : 0;
                    })()}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3Icon className="h-5 w-5 text-primary" />
                Service Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Unique Services</span>
                    <span className="text-2xl font-bold">{stats.unique_services}</span>
                  </div>
                  <Progress
                    value={(stats.unique_services / (stats.unique_services * 1.5)) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Bookings per Service</span>
                    <span className="text-2xl font-bold">
                      {(stats.total_bookings / stats.unique_services)?.toFixed(1)}
                    </span>
                  </div>
                  <Progress
                    value={(stats.total_bookings / (stats.unique_services * stats.total_bookings)) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 
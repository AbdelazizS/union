import { useState } from "react";
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DataTable } from "@/Components/ui/data-table";
import { DateRangePicker } from "@/Components/ui/date-range-picker";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
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
  Legend
} from "recharts";
import { motion } from "framer-motion";
import {
  BarChart2,
  PoundSterling,
  Briefcase,
  PieChart as PieChartIcon,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity,
  Table,
  Clock
} from "lucide-react";

// Professional color palette for data visualization
const CHART_COLORS = {
  blue: "#3b82f6",
  purple: "#8b5cf6",
  teal: "#14b8a6",
  amber: "#f59e0b",
  rose: "#f43f5e"
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card/95 backdrop-blur-sm px-3 py-2 shadow-lg">
        <p className="mb-2 font-medium border-b pb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="flex items-center gap-2 text-sm py-1">
            <span 
              className="h-2.5 w-2.5 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium tabular-nums">
              {entry.name.includes('Revenue') ? '£' : ''}
              {entry.value.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, change, icon: Icon, color, metric }) => (
  <Card className="relative overflow-hidden transition-all hover:shadow-md">
    <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-border to-transparent" />
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${color}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          {title}
        </div>
      </CardTitle>
      <span className={`text-xs font-medium flex items-center gap-1 ${
        change >= 0 ? 'text-emerald-600' : 'text-rose-600'
      }`}>
        {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {Math.abs(change)}%
      </span>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col">
        <div className="text-2xl font-bold tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {metric && (
          <p className="text-xs text-muted-foreground mt-1">
            {metric}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

const columns = [
  {
    accessorKey: "name",
    header: "Service Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "total_bookings",
    header: "Total Bookings",
  },
  {
    accessorKey: "total_revenue",
    header: "Total Revenue",
    cell: ({ row }) => {
      const value = row.original.total_revenue;
      const amount = typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? parseFloat(value)
          : 0;
      return `£${amount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "average_revenue",
    header: "Average Revenue",
    cell: ({ row }) => {
      const value = row.original.average_revenue;
      const amount = typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? parseFloat(value)
          : 0;
      return `£${amount.toFixed(2)}`;
    },
  },
];

export default function Services({ services, dateRange }) {
  const [date, setDate] = useState([
    new Date(dateRange.start),
    new Date(dateRange.end),
  ]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    window.location.href = route('admin.reports.services', {
      start_date: format(newDate[0], 'yyyy-MM-dd'),
      end_date: format(newDate[1], 'yyyy-MM-dd'),
    });
  };

  // Data preparation
  const totalRevenue = services.reduce((sum, service) => {
    const value = service.total_revenue;
    return sum + (typeof value === 'number' ? value : parseFloat(value) || 0);
  }, 0);

  

  
  
  const totalBookings = services.reduce((sum, service) => sum + service.total_bookings, 0);
  const avgRevenuePerBooking = totalRevenue / totalBookings;
  
  // Top services by bookings with trend data
  const topServicesByBookings = [...services]
    .sort((a, b) => b.total_bookings - a.total_bookings)
    .slice(0, 5)
    .map(service => ({
      name: service.name,
      bookings: service.total_bookings,
      revenue: parseFloat(service.total_revenue),
      avgRevenue: parseFloat(service.total_revenue) / service.total_bookings
    }));

  // Revenue by category with percentage
  const revenueByCategory = services.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(service.total_revenue);
    return acc;
  }, {});

  const pieChartData = Object.entries(revenueByCategory)
    .map(([category, revenue]) => ({
      name: category,
      value: revenue,
      percentage: (revenue / totalRevenue * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  // Mock growth data (replace with real data in production)
  const growth = {
    services: 8.5,
    bookings: 12.3,
    revenue: 15.7
  };

  return (
    <AdminLayout>
      <Head title="Services Analytics" />

      <div className="container mx-auto py-8 space-y-8 px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive analysis and performance metrics
            </p>
          </div>
          {/* <DateRangePicker date={date} onDateChange={handleDateChange} /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Active Services"
            value={services.length}
            change={growth.services}
            icon={Briefcase}
            color="bg-primary"
            metric="Total available services"
          />
          <StatCard
            title="Total Bookings"
            value={totalBookings.toLocaleString()}
            change={growth.bookings}
            icon={Calendar}
            color="bg-primary"
            metric={`${(totalBookings / services.length).toFixed(1)} avg. per service`}
          />
          <StatCard
            title="Total Revenue"
            value={`£${totalRevenue.toLocaleString()}`}
            change={growth.revenue}
            icon={PoundSterling}
            color="bg-primary"
            metric={`£${avgRevenuePerBooking.toFixed(2)} avg. per booking`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-primary" />
                Service Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topServicesByBookings} margin={{ left: 10 }}>
                  <defs>
                    {Object.entries(CHART_COLORS).map(([name, color], index) => (
                      <linearGradient key={name} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.2} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="bookings"
                    fill={`url(#gradient0)`}
                    name="Bookings"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    fill={`url(#gradient1)`}
                    name="Revenue ($)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Revenue Distribution by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    innerRadius={85}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5 text-primary" />
              Service Performance Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={services} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 
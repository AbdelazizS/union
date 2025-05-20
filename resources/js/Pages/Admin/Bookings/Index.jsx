import { useState } from "react";
import { Head } from "@inertiajs/react";
import { toast } from "sonner";
import { Calendar, Plus } from "lucide-react";
import { format } from "date-fns";
import { router } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { columns, statuses } from "./columns";
import AdminLayout from '../../../layouts/AdminLayout.jsx';

export default function BookingsIndex({ bookings, filters }) {
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: filters.date_from ? new Date(filters.date_from) : undefined,
    to: filters.date_to ? new Date(filters.date_to) : undefined,
  });

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
    router.get(
      route("admin.bookings.index"),
      {
        ...filters,
        date_from: range.from ? format(range.from, "yyyy-MM-dd") : null,
        date_to: range.to ? format(range.to, "yyyy-MM-dd") : null,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleSearch = (term) => {
    router.get(
      route("admin.bookings.index"),
      { ...filters, search: term },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleStatusFilter = (status) => {
    router.get(
      route("admin.bookings.index"),
      { ...filters, status: status === "all" ? null : status },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleStatusChange = async (id, action) => {
    try {
      await router.post(route(`admin.bookings.${action}`, id), null, {
        onSuccess: () => {
          toast.success(`Booking ${action}ed successfully`);
        },
        onError: () => {
          toast.error(`Failed to ${action} booking`);
        },
        preserveScroll: true,
      });
    } catch (error) {
      toast.error(`An error occurred while ${action}ing the booking`);
    }
  };

  const handleConfirmBooking = (id) => handleStatusChange(id, "confirm");
  const handleCompleteBooking = (id) => handleStatusChange(id, "complete");
  const handleCancelBooking = (id) => handleStatusChange(id, "cancel");

  const tableColumns = columns({
    onConfirm: handleConfirmBooking,
    onComplete: handleCompleteBooking,
    onCancel: handleCancelBooking,
  });

  return (
    <AdminLayout>
      <Head title="Bookings" />

      <div className="p-4 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Manage and track all cleaning service bookings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.visit(route("admin.bookings.create"))}>
            <Plus className="mr-2 h-4 w-4" /> New Booking
          </Button>
        </div>
      </div>

      <div className="p-4 my-4 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search bookings..."
            className="max-w-[300px]"
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker
            value={selectedDateRange}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>

      <div className="p-4">
        <DataTable
          data={bookings}
          columns={tableColumns}
          defaultPageSize={10}
          pageSizeOptions={[10, 20, 30, 40, 50]}
        />
      </div>
    </AdminLayout>
  );
} 
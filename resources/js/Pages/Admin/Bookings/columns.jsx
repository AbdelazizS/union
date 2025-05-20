import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";

export const columns = ({ onConfirm, onComplete, onCancel }) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "booking_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Booking #" />
    ),
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: "service.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
    ),
  },
  {
    accessorKey: "booking_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => format(new Date(row.getValue("booking_date")), "PPP"),
  },
  {
    accessorKey: "duration_hours",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => `${row.getValue("duration_hours")} hours`,
  },
  {
    accessorKey: "frequency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Frequency" />
    ),
    cell: ({ row }) => {
      const frequency = row.getValue("frequency") || "one_time";
      return (
        <span className="capitalize">
          {frequency.replace("_", " ")}
        </span>
      );
    },
  },
  {
    accessorKey: "final_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        £{parseFloat(row.getValue("final_amount")).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");
      const variants = {
        pending: "warning",
        confirmed: "info",
        completed: "success",
        cancelled: "destructive",
      };

      return (
        <Badge variant={variants[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;
      const canConfirm = booking.status === "pending";
      const canComplete = booking.status === "confirmed";
      const canCancel = ["pending", "confirmed"].includes(booking.status);

      return (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: "View Details",
              href: route("admin.bookings.show", booking.id),
            },
            {
              label: "Edit Booking",
              href: route("admin.bookings.edit", booking.id),
            },
            canConfirm && {
              label: "Confirm Booking",
              onClick: () => onConfirm(booking),
            },
            canComplete && {
              label: "Mark as Completed",
              onClick: () => onComplete(booking),
            },
            canCancel && {
              label: "Cancel Booking",
              onClick: () => onCancel(booking),
              variant: "destructive",
            },
          ].filter(Boolean)}
        />
      );
    },
  },
];

export const statuses = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

export const frequencies = [
  {
    value: "one_time",
    label: "One Time"
  },
  {
    value: "weekly", 
    label: "Weekly"
  },
  {
    value: "biweekly",
    label: "Bi-weekly"
  },
  {
    value: "monthly",
    label: "Monthly"
  }
];
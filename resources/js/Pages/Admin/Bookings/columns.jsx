import { MoreHorizontal, Pencil, Trash, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "@inertiajs/react";

export const columns = ({ onConfirm, onComplete, onCancel }) => [
  {
    accessorKey: "booking_number",
    header: "Booking #",
    cell: ({ row }) => <div className="font-medium">{row.original.booking_number}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.customer_name}</div>
        <div className="text-sm text-gray-500">{row.original.customer_email}</div>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.service?.name}</div>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "booking_date",
    header: "Date & Time",
    cell: ({ row }) => (
      <div>
        <div>{format(new Date(row.original.booking_date), "MMM d, yyyy")}</div>
        <div className="text-sm text-gray-500">
          {row.original.booking_time}
        </div>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "final_amount",
    header: "Total Price",
    cell: ({ row }) => (
      <div className="font-medium">£{Number(row.original.final_amount).toFixed(2)}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={route('admin.bookings.show', booking.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            {booking.status === 'pending' && (
              <>
                <DropdownMenuItem onClick={() => onConfirm(booking.id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCancel(booking.id)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              </>
            )}
            {booking.status === 'confirmed' && (
              <>
                <DropdownMenuItem onClick={() => onComplete(booking.id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCancel(booking.id)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function getStatusVariant(status) {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'info';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'destructive';
    case 'completed':
      return 'default';
    default:
      return 'secondary';
  }
}

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
import { MoreHorizontal, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";

export const columns = ({ handleEdit, handleToggleStatus, confirmDelete }) => [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("type")}</span>
    ),
  },
  {
    accessorKey: "discount_value",
    header: "Discount",
    cell: ({ row }) => {
      const type = row.getValue("type");
      const value = row.getValue("discount_value");
      return type === "percentage" ? `${value}%` : `£${value}`;
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("is_active") ? "info" : "warning"}>
        {row.getValue("is_active") ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "usage_count",
    header: "Usage",
    cell: ({ row }) => {
      const limit = row.original.usage_limit;
      return `${row.getValue("usage_count")} ${limit ? `/ ${limit}` : ""}`;
    },
  },
  {
    accessorKey: "valid_from",
    header: "Valid Period",
    cell: ({ row }) => {
      const validFrom = row.getValue("valid_from");
      const validUntil = row.original.valid_until;
      return (
        <span className="whitespace-nowrap">
          {validFrom ? format(new Date(validFrom), "PP") : "Any time"} -{" "}
          {validUntil ? format(new Date(validUntil), "PP") : "No expiry"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const coupon = row.original;

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
            <DropdownMenuItem onClick={() => handleEdit(coupon)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(coupon)}>
              {coupon.is_active ? (
                <>
                  <ToggleLeft className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <ToggleRight className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => confirmDelete(coupon)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 
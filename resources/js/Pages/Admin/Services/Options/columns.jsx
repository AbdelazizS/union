import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
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

export const columns = (handleEdit, handleDelete, handleView) => [
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => <div className="font-medium">{row.original.label}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div>£{Number(row.original.price).toFixed(2)}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "quantity_range",
    header: "Quantity Range",
    cell: ({ row }) => (
      <div>
        {row.original.min_qty}
        {row.original.max_qty ? ` - ${row.original.max_qty}` : '+'}
        {row.original.is_variable ? ' (Variable)' : ' (Fixed)'}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => <div>{row.original.note || '-'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.is_active ? "success" : "secondary"}
      >
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const option = row.original;

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
            <DropdownMenuItem onClick={() => handleView(option)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(option)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(option)}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 
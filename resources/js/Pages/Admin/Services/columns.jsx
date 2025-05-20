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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="h-10 w-10 relative rounded overflow-hidden border">
        <img
          src={row.original.image_url}
          alt={row.original.name}
          className="object-cover w-full h-full"
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => <div>{row.original.category?.name}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "base_price",
    header: "Base Price",
    cell: ({ row }) => (
      <div>£{Number(row.original.base_price).toFixed(2)}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "duration_minutes",
    header: "Duration",
    cell: ({ row }) => (
      <div>{row.original.duration_minutes} minutes</div>
    ),
    enableSorting: true,
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
      const service = row.original;

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
            <DropdownMenuItem onClick={() => handleView(service)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(service)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(service)}
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
import { MoreHorizontal, Pencil, Trash, Eye, Settings } from "lucide-react";
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
import { router } from "@inertiajs/react";

export const columns = (handleEdit, handleDelete, handleToggleStatus, handleView) => [
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
    cell: ({ row }) => <div>{row.original.category?.name || '-'}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "pricing_options",
    header: "Pricing Options",
    cell: ({ row }) => {
      const options = row.original.options || [];
      return (
        <div className="space-y-1">
          {options.map((option) => (
            <div key={option.id} className="text-sm">
              <span className="font-medium">{option.label}:</span>{' '}
              £{Number(option.price).toFixed(2)}
              {option.is_variable && (
                <span className="text-gray-500 ml-1">
                  (per unit, {option.min_qty}-{option.max_qty} units)
                </span>
              )}
            </div>
          ))}
          {options.length === 0 && (
            <span className="text-gray-500 text-sm">No pricing options set</span>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.is_active ? "success" : "secondary"}
        className="cursor-pointer"
        onClick={() => handleToggleStatus(row.original)}
      >
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    id: "manage_options",
    header: "Options",
    cell: ({ row }) => {
      const service = row.original;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.visit(route('admin.services.options.index', service.id))}
        >
          <Settings className="mr-2 h-4 w-4" />
          Manage Options
        </Button>
      );
    },
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
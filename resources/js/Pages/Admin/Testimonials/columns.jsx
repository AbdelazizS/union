import { MoreHorizontal, Pencil, Trash, Eye, Star } from "lucide-react";
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

export const columns = (handleEdit, handleDelete, handleView) => [
  {
    accessorKey: "customer_name",
    header: "Customer Name",
    cell: ({ row }) => <div className="font-medium">{row.original.customer_name}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "customer_email",
    header: "Email",
    cell: ({ row }) => <div>{row.original.customer_email}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center">
        {[...Array(row.original.rating)].map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "is_approved",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.is_approved ? "success" : "secondary"}
      >
        {row.original.is_approved ? "Approved" : "Pending"}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "is_featured",
    header: "Featured",
    cell: ({ row }) => (
      <Badge
        variant={row.original.is_featured ? "default" : "outline"}
      >
        {row.original.is_featured ? "Featured" : "Not Featured"}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const testimonial = row.original;

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
            <DropdownMenuItem onClick={() => handleView(testimonial)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(testimonial)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(testimonial)}
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
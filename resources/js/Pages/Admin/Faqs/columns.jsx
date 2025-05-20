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
    accessorKey: "question",
    header: "Question",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate font-medium">
        {row.original.question}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.category}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "answer",
    header: "Answer",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-muted-foreground">
        {row.original.answer}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "sort_order",
    header: "Sort Order",
    cell: ({ row }) => <div>{row.original.sort_order}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "success" : "secondary"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const faq = row.original;

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
            <DropdownMenuItem onClick={() => handleView(faq)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(faq)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(faq)}
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
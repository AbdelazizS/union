import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { toast } from "sonner";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Components
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { CouponForm } from "./CouponForm";
import { columns } from "./columns";

// Icons
import {
  ChevronDownIcon,
  SearchIcon,
  MoreHorizontalIcon,
  ArrowUpDown,
} from "lucide-react";

const formSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(50, "Code must be less than 50 characters"),
  type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce
    .number()
    .min(0, "Discount value must be greater than 0")
    .max(100, "Percentage discount cannot exceed 100%")
    .nullable()
    .default(null),
  min_order_amount: z.coerce
    .number()
    .min(0, "Minimum order amount must be greater than 0")
    .nullable(),
  max_discount_amount: z.coerce
    .number()
    .min(0, "Maximum discount amount must be greater than 0")
    .nullable(),
  usage_limit: z.coerce
    .number()
    .int("Usage limit must be a whole number")
    .min(1, "Usage limit must be at least 1")
    .nullable(),
  valid_from: z.date().nullable(),
  valid_until: z.date().nullable(),
  is_active: z.boolean().default(true),
  applicable_categories: z.array(z.number()).nullable(),
  applicable_services: z.array(z.number()).nullable(),
});

const defaultValues = {
  code: "",
  type: "percentage",
  discount_value: null,
  min_order_amount: null,
  max_discount_amount: null,
  usage_limit: null,
  valid_from: null,
  valid_until: null,
  is_active: true,
  applicable_categories: null,
  applicable_services: null,
};

export default function Coupons({ coupons }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const editForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const refreshData = () => {
    router.reload({ only: ['coupons'] });
  };

  const onCreateSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      router.post("/admin/coupons", data, {
        onSuccess: () => {
          toast.success("Coupon created successfully");
          setCreateOpen(false);
          createForm.reset(defaultValues);
          refreshData();
        },
        onError: (errors) => {
          console.log(errors);
          toast.error(errors.message || "Something went wrong");
        },
        onFinish: () => {
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      router.put(`/admin/coupons/${editingCoupon.id}`, data, {
        onSuccess: () => {
          toast.success("Coupon updated successfully");
          setEditOpen(false);
          editForm.reset(defaultValues);
          setEditingCoupon(null);
          refreshData();
        },
        onError: (errors) => {
          console.log(errors);
          toast.error(errors.message || "Something went wrong");
        },
        onFinish: () => {
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
      setIsSubmitting(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    editForm.reset({
      ...coupon,
      valid_from: coupon.valid_from ? new Date(coupon.valid_from) : null,
      valid_until: coupon.valid_until ? new Date(coupon.valid_until) : null,
    });
    setEditOpen(true);
  };

  const confirmDelete = (coupon) => {
    setSelectedCoupon(coupon);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCoupon) return;
    
    setIsSubmitting(true);
    try {
      await router.delete(`/admin/coupons/${selectedCoupon.id}`, {
    onSuccess: () => {
      toast.success("Coupon deleted successfully");
          setDeleteOpen(false);
          setSelectedCoupon(null);
          // Force a fresh reload of the page to get new data
          router.visit(route('admin.coupons.index'), {
            preserveScroll: true,
            preserveState: false
          });
    },
    onError: (error) => {
          console.error('Delete error:', error);
          toast.error(error.message || "Failed to delete coupon");
        },
        onFinish: () => {
          setIsSubmitting(false);
        },
        preserveScroll: true
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete coupon");
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      router.put(route('admin.coupons.toggle-status', coupon.id), {}, {
    onSuccess: () => {
      toast.success("Coupon status updated successfully");
          refreshData();
        },
        onError: (errors) => {
          toast.error(errors.message || "Failed to update coupon status");
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleView = (coupon) => {
    setSelectedCoupon(coupon);
                setShowFormDialog(true);
  };

  const table = useReactTable({
    data: coupons?.data ?? [],
    columns: columns({ 
      handleEdit, 
      handleToggleStatus, 
      confirmDelete
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <AdminLayout>
      <Head title="Coupons" />

      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Coupons</h1>

          {/* Create Dialog */}
          <Dialog
            open={createOpen}
            onOpenChange={(open) => {
              if (!open) {
                createForm.reset(defaultValues);
              }
              setCreateOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Coupon
          </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Coupon</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new coupon.
                </DialogDescription>
              </DialogHeader>
              <CouponForm
                form={createForm}
                onSubmit={onCreateSubmit}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns({ 
            handleEdit, 
            handleToggleStatus, 
            confirmDelete
          })}
          data={coupons?.data ?? []}
          defaultPageSize={10}
          pageSizeOptions={[10, 20, 30, 40, 50]}
        />

        {/* Edit Dialog */}
        <Dialog
          open={editOpen}
          onOpenChange={(open) => {
            if (!open) {
              editForm.reset(defaultValues);
              setEditingCoupon(null);
            }
            setEditOpen(open);
          }}
        >
        <DialogContent>
          <DialogHeader>
              <DialogTitle>Edit Coupon</DialogTitle>
              <DialogDescription>
                Update the details of this coupon.
              </DialogDescription>
            </DialogHeader>
            <CouponForm
              form={editForm}
              onSubmit={onEditSubmit}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
                Are you sure you want to delete the coupon "{selectedCoupon?.code}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
            <div className="flex items-center space-x-2 pt-4">
            <Button
              variant="outline"
                onClick={() => {
                  setDeleteOpen(false);
                  setSelectedCoupon(null);
                }}
                disabled={isSubmitting}
                className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
            </Button>
            </div>
        </DialogContent>
      </Dialog>

        {/* View Modal */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Coupon Details</DialogTitle>
              <DialogDescription>
                View the complete information about this coupon.
              </DialogDescription>
            </DialogHeader>
            {selectedCoupon && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Code</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCoupon.code}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Type</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCoupon.type}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Discount Value</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCoupon.type === "percentage"
                        ? `${selectedCoupon.discount_value}%`
                        : `$${selectedCoupon.discount_value}`}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCoupon.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Usage Count</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCoupon.usage_count} /{" "}
                      {selectedCoupon.usage_limit || "∞"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Valid Period</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCoupon.valid_from
                        ? format(new Date(selectedCoupon.valid_from), "PPP")
                        : "Any time"}{" "}
                      -{" "}
                      {selectedCoupon.valid_until
                        ? format(new Date(selectedCoupon.valid_until), "PPP")
                        : "No expiry"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
} 
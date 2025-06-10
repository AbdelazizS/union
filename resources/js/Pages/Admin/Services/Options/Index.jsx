import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ServiceOptionForm } from "./ServiceOptionForm";
import { usePage } from "@inertiajs/react";
import AdminLayout from '@/Layouts/AdminLayout.jsx';

const formSchema = z.object({
  label: z.string().min(2, "Label must be at least 2 characters"),
  price: z.number().min(0, "Price must be positive"),
  min_qty: z.number().min(1, "Minimum quantity must be at least 1"),
  max_qty: z.number().min(1, "Maximum quantity must be at least 1").optional().nullable(),
  is_variable: z.boolean().default(false),
  note: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.number().default(0),
});

const defaultValues = {
  label: "",
  price: 0,
  min_qty: 1,
  max_qty: null,
  is_variable: false,
  note: "",
  is_active: true,
  sort_order: 0,
};

export default function ServiceOptions({ service, options }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = usePage().props;

  const createForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const editForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const refreshData = () => {
    router.reload({ only: ['options'] });
  };

  const onCreateSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      router.post(route('admin.services.options.store', service.id), data, {
        onSuccess: () => {
          toast.success("Service option created successfully");
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
      router.put(route('admin.services.options.update', [service.id, editingOption.id]), data, {
        onSuccess: () => {
          toast.success("Service option updated successfully");
          setEditOpen(false);
          editForm.reset(defaultValues);
          setEditingOption(null);
          refreshData();
        },
        onError: (errors) => {
          console.error('Update error:', errors);
          toast.error(errors.error || "Something went wrong");
        },
        onFinish: () => {
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Something went wrong");
      setIsSubmitting(false);
    }
  };

  const handleEdit = (option) => {
    setEditingOption(option);
    editForm.reset({
      ...option,
      price: Number(option.price),
      min_qty: Number(option.min_qty),
      max_qty: option.max_qty ? Number(option.max_qty) : null,
    });
    setEditOpen(true);
  };

  const handleDelete = async (option) => {
    setIsSubmitting(true);
    try {
      router.delete(route('admin.services.options.destroy', [service.id, option.id]), {
        onSuccess: () => {
          toast.success("Service option deleted successfully");
          setDeleteOpen(false);
          setSelectedOption(null);
          refreshData();
        },
        onError: (errors) => {
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

  const handleView = (option) => {
    setSelectedOption(option);
    setViewOpen(true);
  };

  const confirmDelete = (option) => {
    setSelectedOption(option);
    setDeleteOpen(true);
  };

  return (
    <AdminLayout>
      <Head title={`${service.name} - Service Options`} />
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <p className="text-muted-foreground mt-1">Manage service options and pricing</p>
          </div>
          
          {/* Create Dialog */}
          <Dialog open={createOpen} onOpenChange={(open) => {
            if (!open) {
              createForm.reset(defaultValues);
            }
            setCreateOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Option</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new service option.
                </DialogDescription>
              </DialogHeader>
              <ServiceOptionForm
                form={createForm}
                onSubmit={onCreateSubmit}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editOpen} onOpenChange={(open) => {
            if (!open) {
              editForm.reset(defaultValues);
              setEditingOption(null);
            }
            setEditOpen(open);
          }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Option</DialogTitle>
                <DialogDescription>
                  Update the details of this service option.
                </DialogDescription>
              </DialogHeader>
              <ServiceOptionForm
                form={editForm}
                onSubmit={onEditSubmit}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns(handleEdit, confirmDelete, handleView)}
          data={options}
          searchKey="label"
        />

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Option</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this option? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedOption)}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Option Details</DialogTitle>
            </DialogHeader>
            {selectedOption && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Label</h3>
                  <p>{selectedOption.label}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Price</h3>
                  <p>£{Number(selectedOption.price).toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Quantity Range</h3>
                  <p>
                    {selectedOption.min_qty}
                    {selectedOption.max_qty ? ` - ${selectedOption.max_qty}` : '+'}
                    {selectedOption.is_variable ? ' (Variable)' : ' (Fixed)'}
                  </p>
                </div>
                {selectedOption.note && (
                  <div>
                    <h3 className="font-semibold">Note</h3>
                    <p>{selectedOption.note}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p>{selectedOption.is_active ? "Active" : "Inactive"}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
} 
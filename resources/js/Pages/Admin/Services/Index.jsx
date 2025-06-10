import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Plus, Settings } from "lucide-react";
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
import { ServiceForm } from "./ServiceForm";
import { usePage } from "@inertiajs/react";
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { ImageUpload } from "@/components/ui/image-upload";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category_id: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.array(z.string()).optional(),
  is_active: z.boolean().default(true),
  image: z.string().optional(),
});

const defaultValues = {
  name: "",
  category_id: "",
  description: "",
  features: [""],
  is_active: true,
  image: "",
};

export default function Services({ services, categories }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
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
    router.reload({ only: ['services'] });
  };

  const onCreateSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      router.post("/admin/services", data, {
        onSuccess: () => {
          toast.success("Service created successfully");
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
      if (data.image === editingService.image_url) {
        delete data.image;
      }

      router.put(`/admin/services/${editingService.id}`, data, {
        onSuccess: () => {
          toast.success("Service updated successfully");
          setEditOpen(false);
          editForm.reset(defaultValues);
          setEditingService(null);
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

  const handleEdit = (service) => {
    setEditingService(service);
    editForm.reset({
      ...service,
      category_id: service.category?.id?.toString(),
      features: service.features || [],
    });
    setEditOpen(true);
  };

  const handleDelete = async (service) => {
    setIsSubmitting(true);
    try {
      router.delete(route('admin.services.destroy', service.id), {
        onSuccess: () => {
          toast.success("Service deleted successfully");
          setDeleteOpen(false);
          setSelectedService(null);
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

  const handleToggleStatus = async (service) => {
    setIsSubmitting(true);
    try {
      router.put(route('admin.services.toggle-status', service.id), {}, {
        onSuccess: () => {
          toast.success(`Service ${service.is_active ? 'deactivated' : 'activated'} successfully`);
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

  const handleView = (service) => {
    setSelectedService(service);
    setViewOpen(true);
  };

  const confirmDelete = (service) => {
    setSelectedService(service);
    setDeleteOpen(true);
  };

  return (
    <AdminLayout>
      <Head title="Services" />
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Services</h1>
            <p className="text-muted-foreground mt-1">Manage your cleaning services</p>
          </div>
          <Button onClick={() => router.visit(route('admin.services.create'))}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>

        <DataTable
          columns={columns(handleEdit, confirmDelete, handleToggleStatus, handleView)}
          data={services}
          searchKey="name"
        />

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingService(null);
            editForm.reset(defaultValues);
          }
          setEditOpen(open);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Update the details of this service.
              </DialogDescription>
            </DialogHeader>
            <ServiceForm
              form={editForm}
              onSubmit={onEditSubmit}
              isSubmitting={isSubmitting}
              categories={categories}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this service? This action cannot be undone.
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
                onClick={() => handleDelete(selectedService)}
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
              <DialogTitle>View Service Details</DialogTitle>
            </DialogHeader>
            {selectedService && (
              <div className="space-y-4">
                {selectedService.image_url && (
                  <div>
                    <h3 className="font-semibold mb-2">Image</h3>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img
                        src={selectedService.image_url}
                        alt={selectedService.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">Name</h3>
                  <p>{selectedService.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p>{selectedService.category?.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="whitespace-pre-wrap">{selectedService.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p>{selectedService.is_active ? "Active" : "Inactive"}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

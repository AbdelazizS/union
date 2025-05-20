import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { DataTable } from "@/Components/ui/data-table";
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
} from "@/Components/ui/dialog";
import { PartnerForm } from "./PartnerForm";
import AdminLayout from '@/Layouts/AdminLayout';
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  logo: z.union([
    z.instanceof(File)
      .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
    z.string().url().optional(),
    z.string().optional(),
  ]).optional().nullable(),
});

const defaultValues = {
  name: "",
  logo: null,
};

export default function Partners({ partners }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
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
    router.reload({ only: ['partners'] });
  };

  const onCreateSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.logo) {
      if (data.logo instanceof File) {
        formData.append('logo', data.logo);
      } else if (typeof data.logo === 'string' && data.logo.startsWith('data:')) {
        // Convert data URL to File
        const response = await fetch(data.logo);
        const blob = await response.blob();
        const file = new File([blob], 'logo.png', { type: blob.type });
        formData.append('logo', file);
      }
    }

    try {
      router.post("/admin/partners", formData, {
        onSuccess: () => {
          toast.success("Partner created successfully");
          setCreateOpen(false);
          createForm.reset(defaultValues);
          refreshData();
        },
        onError: (errors) => {
          console.error(errors);
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
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    if (data.logo) {
      if (data.logo instanceof File) {
        formData.append('logo', data.logo);
      } else if (typeof data.logo === 'string' && data.logo.startsWith('data:')) {
        // Convert data URL to File
        const response = await fetch(data.logo);
        const blob = await response.blob();
        const file = new File([blob], 'logo.png', { type: blob.type });
        formData.append('logo', file);
      }
    }

    try {
      router.post(`/admin/partners/${editingPartner.id}`, formData, {
        onSuccess: () => {
          toast.success("Partner updated successfully");
          setEditOpen(false);
          editForm.reset(defaultValues);
          setEditingPartner(null);
          refreshData();
        },
        onError: (errors) => {
          console.error(errors);
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

  const handleEdit = (partner) => {
    setEditingPartner(partner);
    editForm.reset({
      name: partner.name,
      logo: null,
    });
    setEditOpen(true);
  };

  const handleDelete = async (partner) => {
    setIsSubmitting(true);
    try {
      router.delete(route('admin.partners.destroy', partner.id), {
        onSuccess: () => {
          toast.success("Partner deleted successfully");
          setDeleteOpen(false);
          setSelectedPartner(null);
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

  const handleView = (partner) => {
    setSelectedPartner(partner);
    setViewOpen(true);
  };

  const confirmDelete = (partner) => {
    setSelectedPartner(partner);
    setDeleteOpen(true);
  };

  return (
    <AdminLayout>
      <Head title="Partners" />
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Partners</h1>
          
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
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Partner</DialogTitle>
                <DialogDescription>
                  Add a new partner to your cleaning service network.
                </DialogDescription>
              </DialogHeader>
              <PartnerForm
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
              setEditingPartner(null);
            }
            setEditOpen(open);
          }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Partner</DialogTitle>
                <DialogDescription>
                  Update the partner's information.
                </DialogDescription>
              </DialogHeader>
              <PartnerForm
                form={editForm}
                onSubmit={onEditSubmit}
                isSubmitting={isSubmitting}
                isEditing={true}
                currentLogo={editingPartner?.logo_path}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns(handleEdit, confirmDelete, handleView)}
              data={partners}
              searchKey="name"
            />
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Partner</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this partner? This action cannot be undone.
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
                onClick={() => handleDelete(selectedPartner)}
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
              <DialogTitle>View Partner Details</DialogTitle>
            </DialogHeader>
            {selectedPartner && (
              <div className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none text-muted-foreground">Logo</h3>
                    <div className="h-40 w-40 relative rounded-lg overflow-hidden border">
                      <img
                        src={selectedPartner.logo_path}
                        alt={selectedPartner.name}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none text-muted-foreground">Name</h3>
                    <p className="text-base font-medium">{selectedPartner.name}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none text-muted-foreground">Slug</h3>
                    <p className="text-sm font-mono bg-muted p-2 rounded">{selectedPartner.slug}</p>
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
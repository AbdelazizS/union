import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { DataTable } from "@/Components/ui/data-table";
import { columns } from "./columns";
import { usePage } from "@inertiajs/react";
import AdminLayout from '@/Layouts/AdminLayout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { ServiceCategoryForm } from "./ServiceCategoryForm";

const defaultValues = {
  name: "",
  description: "",
  hourly_rate: 0,
  is_active: true,
};

export default function ServiceCategories({ serviceCategories }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = usePage().props;

  const refreshData = () => {
    router.reload({ only: ['serviceCategories'] });
  };

  const onCreateSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      router.post("/admin/service-categories", data, {
          onSuccess: () => {
          toast.success("Service category created successfully");
          setCreateOpen(false);
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
      router.put(`/admin/service-categories/${editingCategory.id}`, data, {
          onSuccess: () => {
          toast.success("Service category updated successfully");
          setEditOpen(false);
          setEditingCategory(null);
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

  const handleEdit = (category) => {
    setEditingCategory(category);
    setEditOpen(true);
  };

  const handleDelete = async (category) => {
    setIsSubmitting(true);
    try {
      router.delete(route('admin.service-categories.destroy', category.id), {
        onSuccess: () => {
          toast.success("Service category deleted successfully");
          setDeleteOpen(false);
          setSelectedCategory(null);
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

  const handleView = (category) => {
    setSelectedCategory(category);
    setViewOpen(true);
  };

  const confirmDelete = (category) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };

  return (
    <AdminLayout>
      <Head title="Service Categories" />
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Service Categories</h1>
          
          {/* Create Dialog */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new service category.
                </DialogDescription>
              </DialogHeader>
              <ServiceCategoryForm
                initialData={null}
                onSubmit={onCreateSubmit}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editOpen} onOpenChange={(open) => {
            if (!open) {
              setEditingCategory(null);
            }
            setEditOpen(open);
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update the details of this service category.
                </DialogDescription>
              </DialogHeader>
              <ServiceCategoryForm
                initialData={editingCategory}
                onSubmit={onEditSubmit}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns(handleEdit, confirmDelete, handleView)}
          data={serviceCategories}
          searchKey="name"
        />

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? This action cannot be undone.
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
                onClick={() => handleDelete(selectedCategory)}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Category Details</DialogTitle>
              <DialogDescription>
                View the complete information about this service category.
              </DialogDescription>
            </DialogHeader>
            {selectedCategory && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Name</h3>
                  <p>{selectedCategory.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Hourly Rate</h3>
                  <p>${Number(selectedCategory.hourly_rate).toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p>{selectedCategory.is_active ? "Active" : "Inactive"}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

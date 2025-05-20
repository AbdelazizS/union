import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Plus, Star } from "lucide-react";
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
import { TestimonialForm } from "./TestimonialForm";
import AdminLayout from '@/Layouts/AdminLayout.jsx';

const formSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_email: z.string().email("Invalid email address"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  rating: z.number().min(1).max(5),
  is_featured: z.boolean().default(false),
  is_approved: z.boolean().default(false),
});

const defaultValues = {
  customer_name: "",
  customer_email: "",
  comment: "",
  rating: 5,
  is_featured: false,
  is_approved: false,
};

export default function Testimonials({ testimonials }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
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
    router.reload({ only: ['testimonials'] });
  };

  const onCreateSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      router.post("/admin/testimonials", data, {
        onSuccess: () => {
          toast.success("Testimonial created successfully");
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
      router.put(`/admin/testimonials/${editingTestimonial.id}`, data, {
        onSuccess: () => {
          toast.success("Testimonial updated successfully");
          setEditOpen(false);
          editForm.reset(defaultValues);
          setEditingTestimonial(null);
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

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    editForm.reset({
      ...testimonial,
      rating: Number(testimonial.rating)
    });
    setEditOpen(true);
  };

  const handleDelete = async (testimonial) => {
    setIsSubmitting(true);
    try {
      router.delete(route('admin.testimonials.destroy', testimonial.id), {
        onSuccess: () => {
          toast.success("Testimonial deleted successfully");
          setDeleteOpen(false);
          setSelectedTestimonial(null);
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

  const handleView = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setViewOpen(true);
  };

  const confirmDelete = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setDeleteOpen(true);
  };

  return (
    <AdminLayout>
      <Head title="Testimonials" />
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Testimonials</h1>
          
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
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Testimonial</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new testimonial.
                </DialogDescription>
              </DialogHeader>
              <TestimonialForm
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
              setEditingTestimonial(null);
            }
            setEditOpen(open);
          }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Testimonial</DialogTitle>
                <DialogDescription>
                  Update the details of this testimonial.
                </DialogDescription>
              </DialogHeader>
              <TestimonialForm
                form={editForm}
                onSubmit={onEditSubmit}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns(handleEdit, confirmDelete, handleView)}
          data={testimonials}
          searchKey="customer_name"
        />

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Testimonial</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this testimonial? This action cannot be undone.
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
                onClick={() => handleDelete(selectedTestimonial)}
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
              <DialogTitle>View Testimonial Details</DialogTitle>
            </DialogHeader>
            {selectedTestimonial && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Customer Name</h3>
                  <p>{selectedTestimonial.customer_name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>{selectedTestimonial.customer_email}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Comment</h3>
                  <p className="whitespace-pre-wrap">{selectedTestimonial.comment}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Rating</h3>
                  <div className="flex items-center">
                    {[...Array(selectedTestimonial.rating)].map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Featured Status</h3>
                  <p>{selectedTestimonial.is_featured ? "Featured" : "Not Featured"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Approval Status</h3>
                  <p>{selectedTestimonial.is_approved ? "Approved" : "Pending"}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
} 
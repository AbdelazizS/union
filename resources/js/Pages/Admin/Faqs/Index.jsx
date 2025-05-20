import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {Plus } from "lucide-react";
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
import { FaqForm } from "./FaqForm";
import AdminLayout from '../../../layouts/AdminLayout.jsx';
import { Badge } from "@/Components/ui/badge";

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  sort_order: z.number().min(0, "Sort order must be positive"),
  is_active: z.boolean().default(true),
});

const defaultValues = {
  category: "",
  question: "",
  answer: "",
  sort_order: 0,
  is_active: true,
};

export default function Faqs({ faqs, categories }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [selectedFaq, setSelectedFaq] = useState(null);
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
    router.reload({ only: ['faqs'] });
  };

  const onCreateSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      router.post("/admin/faqs", data, {
        onSuccess: () => {
          toast.success("FAQ created successfully");
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
      router.put(`/admin/faqs/${editingFaq.id}`, data, {
        onSuccess: () => {
          toast.success("FAQ updated successfully");
          setEditOpen(false);
          editForm.reset(defaultValues);
          setEditingFaq(null);
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

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    editForm.reset({
      ...faq,
      sort_order: Number(faq.sort_order)
    });
    setEditOpen(true);
  };

  const handleDelete = async (faq) => {
    setIsSubmitting(true);
    try {
      router.delete(route('admin.faqs.destroy', faq.id), {
        onSuccess: () => {
          toast.success("FAQ deleted successfully");
          setDeleteOpen(false);
          setSelectedFaq(null);
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

  const handleView = (faq) => {
    setSelectedFaq(faq);
    setViewOpen(true);
  };

  const confirmDelete = (faq) => {
    setSelectedFaq(faq);
    setDeleteOpen(true);
  };

  return (
    <AdminLayout>
      <Head title="FAQs" />
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">FAQs</h1>
          
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
                Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New FAQ</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new FAQ.
                </DialogDescription>
              </DialogHeader>
              <FaqForm
                form={createForm}
                onSubmit={onCreateSubmit}
                isSubmitting={isSubmitting}
                categories={categories}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editOpen} onOpenChange={(open) => {
            if (!open) {
              editForm.reset(defaultValues);
              setEditingFaq(null);
            }
            setEditOpen(open);
          }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit FAQ</DialogTitle>
                <DialogDescription>
                  Update the details of this FAQ.
                </DialogDescription>
              </DialogHeader>
              <FaqForm
                form={editForm}
                onSubmit={onEditSubmit}
                isSubmitting={isSubmitting}
                categories={categories}
              />
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns(handleEdit, confirmDelete, handleView)}
          data={faqs}
          searchKey="question"
          filterKey="category"
          filterOptions={Object.keys(categories).map(category => ({
            label: category,
            value: category,
          }))}
        />

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete FAQ</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this FAQ? This action cannot be undone.
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
                onClick={() => handleDelete(selectedFaq)}
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
              <DialogTitle>View FAQ Details</DialogTitle>
            </DialogHeader>
            {selectedFaq && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none text-muted-foreground">Category</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-base py-1.5">
                        {selectedFaq.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none text-muted-foreground">Question</h3>
                    <p className="text-base font-medium">{selectedFaq.question}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none text-muted-foreground">Answer</h3>
                    <div className="rounded-md bg-muted p-4">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{selectedFaq.answer}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium leading-none text-muted-foreground">Sort Order</h3>
                      <p className="text-base font-medium">{selectedFaq.sort_order}</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium leading-none text-muted-foreground">Status</h3>
                      <Badge variant={selectedFaq.is_active ? "success" : "secondary"} className="text-base py-1">
                        {selectedFaq.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
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
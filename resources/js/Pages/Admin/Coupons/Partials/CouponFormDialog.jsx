import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(50, "Code must be less than 50 characters"),
  type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce
    .number()
    .min(0, "Discount value must be greater than 0")
    .max(100, "Percentage discount cannot exceed 100%"),
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

export default function CouponFormDialog({ open, onOpenChange, coupon }) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      discount_value: 0,
      min_order_amount: null,
      max_discount_amount: null,
      usage_limit: null,
      valid_from: null,
      valid_until: null,
      is_active: true,
      applicable_categories: null,
      applicable_services: null,
    },
  });

  useEffect(() => {
    if (coupon) {
      form.reset({
        ...coupon,
        valid_from: coupon.valid_from ? new Date(coupon.valid_from) : null,
        valid_until: coupon.valid_until ? new Date(coupon.valid_until) : null,
      });
    } else {
      form.reset({
        code: "",
        type: "percentage",
        discount_value: 0,
        min_order_amount: null,
        max_discount_amount: null,
        usage_limit: null,
        valid_from: null,
        valid_until: null,
        is_active: true,
        applicable_categories: null,
        applicable_services: null,
      });
    }
  }, [coupon]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (coupon) {
        await axios.put(`/admin/coupons/${coupon.id}`, values);
      } else {
        await axios.post("/admin/coupons", values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      toast.success(`Coupon ${coupon ? "updated" : "created"} successfully`);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  function onSubmit(values) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
          <DialogDescription>
            {coupon
              ? "Edit the details of the existing coupon"
              : "Create a new discount coupon"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="SUMMER2024" {...field} />
                  </FormControl>
                  <FormDescription>
                    The code customers will enter to apply the discount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose between percentage or fixed amount discount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        form.watch("type") === "percentage" ? "10" : "50"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {form.watch("type") === "percentage"
                      ? "Percentage discount (0-100)"
                      : "Fixed amount discount"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="min_order_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Order Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum order amount required to use this coupon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_discount_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Discount Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum amount that can be discounted
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usage_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of times this coupon can be used
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="valid_from"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Valid From</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Valid Until</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <
                            new Date(
                              form.watch("valid_from") ||
                                new Date().setHours(0, 0, 0, 0)
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Enable or disable this coupon
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <span>Saving...</span>
                ) : coupon ? (
                  "Update Coupon"
                ) : (
                  "Create Coupon"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 
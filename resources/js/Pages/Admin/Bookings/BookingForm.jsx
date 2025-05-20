import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import { format, addDays } from "date-fns";
import { CalendarIcon, Clock, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const bookingFormSchema = z.object({
  service_id: z.string().min(1, "Service is required"),
  booking_date: z.date({
    required_error: "Booking date is required",
  }),
  duration_hours: z.coerce.number().min(1, "Duration must be at least 1 hour"),
  frequency: z.enum(["one_time", "weekly", "biweekly", "monthly"], {
    required_error: "Please select a frequency",
  }),
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(10, "Phone number must be at least 10 digits"),
  customer_address: z.string().min(5, "Address must be at least 5 characters"),
  notes: z.string().optional(),
  coupon_code: z.string().optional(),
});

export function BookingForm({ services, initialData = null, isEdit = false }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState(null);

  const form = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      service_id: initialData?.service_id ? String(initialData.service_id) : "",
      booking_date: initialData?.booking_date ? new Date(initialData.booking_date) : new Date(),
      duration_hours: initialData?.duration_hours || 1,
      frequency: initialData?.frequency || "one_time",
      customer_name: initialData?.customer_name || "",
      customer_email: initialData?.customer_email || "",
      customer_phone: initialData?.customer_phone || "",
      customer_address: initialData?.customer_address || "",
      notes: initialData?.notes || "",
      coupon_code: initialData?.coupon?.code || "",
    },
  });

  const calculatePrice = async (data) => {
    try {
      const response = await router.post(route("api.bookings.calculate-price"), data, {
        preserveState: true,
        preserveScroll: true,
      });
      setPriceBreakdown(response.data);
    } catch (error) {
      console.error("Error calculating price:", error);
      toast.error("Failed to calculate price");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const adjustedData = {
        ...data,
        booking_date: addDays(data.booking_date, 1)
      };

      if (isEdit) {
        await router.patch(route("admin.bookings.update", initialData.id), adjustedData, {
          onSuccess: () => {
            toast.success("Booking updated successfully");
            router.visit(route("admin.bookings.index"));
          },
          onError: (errors) => {
            Object.keys(errors).forEach((key) => {
              form.setError(key, { message: errors[key] });
            });
            toast.error("Please check the form for errors");
          },
        });
      } else {
        await router.post(route("admin.bookings.store"), adjustedData, {
          onSuccess: () => {
            toast.success("Booking created successfully");
            router.visit(route("admin.bookings.index"));
          },
          onError: (errors) => {
            Object.keys(errors).forEach((key) => {
              form.setError(key, { message: errors[key] });
            });
            toast.error("Please check the form for errors");
          },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while saving the booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Service Details</h3>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="service_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={String(service.id)}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="booking_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Booking Date</FormLabel>
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
                              date < new Date() || date < new Date("1900-01-01")
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
                  name="duration_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (hours)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="one_time">One Time</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Customer Information</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <Separator />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Any special instructions or requirements
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coupon_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {priceBreakdown && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Price Breakdown</h3>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>${priceBreakdown.base_amount}</span>
                  </div>
                  {priceBreakdown.frequency_discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Frequency Discount:</span>
                      <span>-${priceBreakdown.frequency_discount}</span>
                    </div>
                  )}
                  {priceBreakdown.bulk_discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bulk Discount:</span>
                      <span>-${priceBreakdown.bulk_discount}</span>
                    </div>
                  )}
                  {priceBreakdown.coupon_discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount:</span>
                      <span>-${priceBreakdown.coupon_discount}</span>
                    </div>
                  )}
                  {priceBreakdown.special_period_adjustment !== 0 && (
                    <div className="flex justify-between">
                      <span>Special Period Adjustment:</span>
                      <span className={cn(
                        priceBreakdown.special_period_adjustment > 0 
                          ? "text-red-600" 
                          : "text-green-600"
                      )}>
                        {priceBreakdown.special_period_adjustment > 0 ? "+" : "-"}
                        ${Math.abs(priceBreakdown.special_period_adjustment)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Final Price:</span>
                    <span>${priceBreakdown.final_amount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.visit(route("admin.bookings.index"))}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEdit ? "Update Booking" : "Create Booking"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
} 
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import { format, addDays } from "date-fns";
import { CalendarIcon, Clock, Users } from "lucide-react";
import PropTypes from 'prop-types';

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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  service_id: z.string().min(1, "Please select a service"),
  selected_options: z.array(z.object({
    option_id: z.string(),
    quantity: z.number().min(1).optional(),
  })).default([]),
  booking_date: z.date({
    required_error: "Please select a date",
  }),
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(10, "Phone number must be at least 10 digits"),
  customer_address: z.string().min(5, "Address must be at least 5 characters"),
  notes: z.string().optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).default("pending"),
});

export function BookingForm({ 
  onSubmit, 
  initialData = null, 
  isSubmitting = false,
  services = [],
  availableTimeSlots = [],
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      service_id: "",
      selected_options: [],
      booking_date: undefined,
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      customer_address: "",
      notes: "",
      status: "pending",
    },
  });

  const selectedServiceId = form.watch("service_id");
  const selectedOptions = form.watch("selected_options");

  const selectedService = services.find(s => s.id.toString() === selectedServiceId);
  const serviceOptions = selectedService?.options || [];

  // Calculate total price based on selected options
  const calculateTotalPrice = () => {
    let total = 0;
    
    selectedOptions.forEach(selectedOption => {
      const option = serviceOptions.find(opt => opt.id.toString() === selectedOption.option_id);
      if (option) {
        const price = parseFloat(option.price) || 0;
        if (option.is_variable) {
          const quantity = parseInt(selectedOption.quantity) || 1;
          total += price * quantity;
        } else {
          total += price;
        }
      }
    });

    return total.toFixed(2);
  };

  const totalPrice = calculateTotalPrice();

  // Reset selected options when service changes
  useEffect(() => {
    form.setValue("selected_options", []);
  }, [selectedServiceId]);

  const handleOptionChange = (optionId, checked) => {
    const currentOptions = form.getValues("selected_options");
    const option = serviceOptions.find(opt => opt.id.toString() === optionId);

    if (checked) {
      // Add option with default quantity if variable
      form.setValue("selected_options", [
        ...currentOptions,
        {
          option_id: optionId,
          quantity: option?.is_variable ? 1 : undefined
        }
      ]);
    } else {
      // Remove option
      form.setValue("selected_options", 
        currentOptions.filter(opt => opt.option_id !== optionId)
      );
    }
  };

  const handleQuantityChange = (optionId, quantity) => {
    const currentOptions = form.getValues("selected_options");
    const updatedOptions = currentOptions.map(opt => 
      opt.option_id === optionId 
        ? { ...opt, quantity: Number(quantity) }
        : opt
    );
    form.setValue("selected_options", updatedOptions);
  };

  const handleSubmit = async (data) => {
    try {
      console.log('Submitting form data:', data);
      
      // Validate that at least one option is selected
      if (data.selected_options.length === 0) {
        form.setError('selected_options', {
          type: 'manual',
          message: 'Please select at least one service option'
        });
        return;
      }

      // Validate quantities for variable options
      const hasInvalidQuantity = data.selected_options.some(selectedOption => {
        const option = serviceOptions.find(opt => opt.id.toString() === selectedOption.option_id);
        if (option?.is_variable) {
          const quantity = selectedOption.quantity || 1;
          if (option.min_qty && quantity < option.min_qty) {
            form.setError('selected_options', {
              type: 'manual',
              message: `Quantity for ${option.label} must be at least ${option.min_qty}`
            });
            return true;
          }
          if (option.max_qty && quantity > option.max_qty) {
            form.setError('selected_options', {
              type: 'manual',
              message: `Quantity for ${option.label} cannot exceed ${option.max_qty}`
            });
            return true;
          }
        }
        return false;
      });

      if (hasInvalidQuantity) {
        return;
      }

      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

          {selectedService && serviceOptions.length > 0 && (
            <div className="col-span-2">
              <FormLabel>Service Options</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {serviceOptions.map((option) => {
                  const isSelected = selectedOptions.some(opt => opt.option_id === option.id.toString());
                  const selectedOption = selectedOptions.find(opt => opt.option_id === option.id.toString());

                  return (
                    <div key={option.id} className="flex flex-col space-y-2 p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleOptionChange(option.id.toString(), checked)}
                        />
                        <div className="space-y-1">
                          <FormLabel>
                            {option.label}
                            {option.is_variable ? " (per unit)" : ""}
                          </FormLabel>
                          <p className="text-sm text-gray-500">
                            £{Number(option.price).toFixed(2)}
                            {option.note && ` - ${option.note}`}
                          </p>
                          {option.is_variable && isSelected && (
                            <div className="mt-2">
                              <FormLabel className="text-sm">Quantity</FormLabel>
                              <Input
                                type="number"
                                min={option.min_qty || 1}
                                max={option.max_qty}
                                value={selectedOption?.quantity || 1}
                                onChange={(e) => handleQuantityChange(option.id.toString(), e.target.value)}
                                className="w-24"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="col-span-2">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-lg font-bold">
                    {totalPrice === 'NaN' ? '£0.00' : `£${totalPrice}`}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

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
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                <FormLabel>Customer Name</FormLabel>
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
                <FormLabel>Customer Email</FormLabel>
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
                <FormLabel>Customer Phone</FormLabel>
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
                    <FormItem className="col-span-2">
                      <FormLabel>Customer Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter customer's full address"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
              <FormItem className="col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                  <Textarea
                    placeholder="Any additional notes or requirements"
                    className="resize-none"
                    {...field}
                  />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

          {initialData && (
              <FormField
                control={form.control}
              name="status"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Booking" : "Create Booking"}
        </Button>
      </form>
    </Form>
  );
} 

BookingForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isSubmitting: PropTypes.bool,
  services: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    }),
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      min_qty: PropTypes.number,
      max_qty: PropTypes.number,
      is_variable: PropTypes.bool,
      note: PropTypes.string,
      is_active: PropTypes.bool,
    })),
  })).isRequired,
  availableTimeSlots: PropTypes.arrayOf(PropTypes.string),
}; 


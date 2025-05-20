import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Calendar as CalendarIcon,
    Clock,
    DollarSign,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Tag,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import WebsiteLayout from "@/Layouts/WebsiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import axios from "axios";

// Form validation schema
const bookingFormSchema = z.object({
    service_id: z.string().min(1, "Please select a service"),
    booking_date: z.date({
        required_error: "Please select a date",
        invalid_type_error: "That's not a valid date",
    }),
    duration_hours: z.number()
        .min(1, "Duration must be at least 1 hour")
        .max(24, "Duration cannot exceed 24 hours"),
    frequency: z.enum(["one_time", "weekly", "biweekly", "monthly"], {
        required_error: "Please select a frequency",
    }),
    customer_name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),
    customer_email: z.string()
        .email("Please enter a valid email address"),
    customer_phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(20, "Phone number cannot exceed 20 digits"),
    customer_address: z.string()
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address cannot exceed 200 characters"),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
    coupon_code: z.string().max(50, "Coupon code cannot exceed 50 characters").optional(),
});

export default function Create({ service, services }) {
    const [priceDetails, setPriceDetails] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [calculationError, setCalculationError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(null);

    const form = useForm({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            service_id: service?.id?.toString() || "",
            booking_date: new Date(),
            duration_hours: 1,
            frequency: "one_time",
            customer_name: "",
            customer_email: "",
            customer_phone: "",
            customer_address: "",
            notes: "",
            coupon_code: "",
        },
    });

    const frequencies = [
        { value: "one_time", label: "One Time" },
        { value: "weekly", label: "Weekly" },
        { value: "biweekly", label: "Bi-weekly" },
        { value: "monthly", label: "Monthly" },
    ];

    useEffect(() => {
        if (form.watch("service_id") && form.watch("duration_hours")) {
            calculatePrice();
        }
    }, [form.watch("service_id"), form.watch("duration_hours"), form.watch("coupon_code")]);

    const calculatePrice = async () => {
        setIsCalculating(true);
        setCalculationError(null);

        try {
            const response = await axios.post(route("website.booking.calculate-price"), {
                service_id: form.getValues("service_id"),
                duration_hours: form.getValues("duration_hours"),
                coupon_code: form.getValues("coupon_code"),
                booking_date: format(form.getValues("booking_date"), "yyyy-MM-dd"),
                frequency: form.getValues("frequency"),
            });
            setPriceDetails(response.data);
        } catch (error) {
            setCalculationError(
                error.response?.data?.message || "Failed to calculate price"
            );
        } finally {
            setIsCalculating(false);
        }
    };

    const onSubmit = (data) => {
        router.post(route("website.booking.store"), {
            ...data,
            booking_date: format(data.booking_date, "yyyy-MM-dd"),
        }, {
            onStart: () => {
                setIsSubmitting(true)
            },
            onFinish: () => {
                setIsSubmitting(false)
            }
        });
    };

    return (
        <WebsiteLayout>
            <Head title="Book Service" />

            <div className="min-h-screen bg-background py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                                Book Your Service
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Fill out the form below to schedule your service appointment
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Service Selection */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-6">
                                                <Sparkles className="h-6 w-6 text-primary" />
                                                <h2 className="text-2xl font-semibold">
                                                    Service Details
                                                </h2>
                                            </div>

                                            <div className="grid gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="service_id"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Select Service</FormLabel>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Choose a service" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {services.map((service) => (
                                                                        <SelectItem
                                                                            key={service.id}
                                                                            value={service.id.toString()}
                                                                        >
                                                                            {service.name} - ${Math.max(service.base_price, service.category.hourly_rate)}/hr
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="duration_hours"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Duration (hours)</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        min="1"
                                                                        max="24"
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
                                                                        {frequencies.map((freq) => (
                                                                            <SelectItem
                                                                                key={freq.value}
                                                                                value={freq.value}
                                                                            >
                                                                                {freq.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="booking_date"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Preferred Date</FormLabel>
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
                                                                            date < new Date()
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
                                                    name="coupon_code"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Coupon Code</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input {...field} placeholder="Enter coupon code" />
                                                                    <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {priceDetails && (
                                                    <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span>Base Price:</span>
                                                            <span>${priceDetails.base_amount}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center font-semibold border-t pt-2">
                                                            <span>Final Price:</span>
                                                            <span>${priceDetails.final_amount}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Customer Information */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-6">
                                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                                <h2 className="text-2xl font-semibold">
                                                    Your Information
                                                </h2>
                                            </div>

                                            <div className="grid gap-6">
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="customer_name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Full Name</FormLabel>
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
                                                                    <Input {...field} type="email" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="customer_phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone Number</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
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
                                                                <Textarea
                                                                    {...field}
                                                                    rows={3}
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
                                                        <FormItem>
                                                            <FormLabel>Additional Notes</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    {...field}
                                                                    rows={3}
                                                                    placeholder="Any special requirements or instructions?"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {calculationError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{calculationError}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                    >
                                        {isSubmitting ? "Processing..." : "Book Now"}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </motion.div>
                </div>
            </div>
        </WebsiteLayout>
    );
} 
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Calendar,
    Clock,
    DollarSign,
    MapPin,
    Mail,
    Phone,
    User,
    FileText,
} from "lucide-react";
import WebsiteLayout from "@/Layouts/WebsiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export default function Confirmation({ booking }) {
    console.log(booking);
    
    return (
        <WebsiteLayout>
            <Head title="Booking Confirmation" />

            <div className="min-h-screen bg-background py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                                <CheckCircle2 className="h-10 w-10 text-primary" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                                Booking Confirmed!
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Thank you for booking with us. We'll contact you shortly to confirm your appointment.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Booking Details */}
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
                                    <div className="grid gap-6">
                                        <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                                            <Calendar className="h-5 w-5 text-primary mt-1" />
                                            <div>
                                                <div className="font-medium">Appointment Date</div>
                                                <div className="text-muted-foreground">
                                                    {format(new Date(booking.booking_date), "MMMM d, yyyy")}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                                            <FileText className="h-5 w-5 text-primary mt-1" />
                                            <div>
                                                <div className="font-medium">Service</div>
                                                <div className="text-muted-foreground">
                                                    {booking.service.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    Category: {booking.service.category.name}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                                                <Clock className="h-5 w-5 text-primary mt-1" />
                                                <div>
                                                    <div className="font-medium">Duration</div>
                                                    <div className="text-muted-foreground">
                                                        {booking.duration_hours} hours
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                                                <DollarSign className="h-5 w-5 text-primary mt-1" />
                                                <div>
                                                    <div className="font-medium">Total Price</div>
                                                    <div className="text-muted-foreground">
                                                        ${booking.final_amount}
                                                        {booking.coupon && (
                                                            <span className="text-green-600 text-sm ml-2">
                                                                (Coupon Applied)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Customer Information */}
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-semibold mb-6">Your Information</h2>
                                    <div className="grid gap-6">
                                        <div className="flex items-start gap-4">
                                            <User className="h-5 w-5 text-primary mt-1" />
                                            <div>
                                                <div className="font-medium">Name</div>
                                                <div className="text-muted-foreground">
                                                    {booking.customer_name}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <Mail className="h-5 w-5 text-primary mt-1" />
                                            <div>
                                                <div className="font-medium">Email</div>
                                                <div className="text-muted-foreground">
                                                    {booking.customer_email}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <Phone className="h-5 w-5 text-primary mt-1" />
                                            <div>
                                                <div className="font-medium">Phone</div>
                                                <div className="text-muted-foreground">
                                                    {booking.customer_phone}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <MapPin className="h-5 w-5 text-primary mt-1" />
                                            <div>
                                                <div className="font-medium">Address</div>
                                                <div className="text-muted-foreground">
                                                    {booking.customer_address}
                                                </div>
                                            </div>
                                        </div>

                                        {booking.notes && (
                                            <div className="flex items-start gap-4">
                                                <FileText className="h-5 w-5 text-primary mt-1" />
                                                <div>
                                                    <div className="font-medium">Additional Notes</div>
                                                    <div className="text-muted-foreground">
                                                        {booking.notes}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Next Steps */}
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-semibold mb-6">Next Steps</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                                                1
                                            </div>
                                            <div>
                                                <div className="font-medium">Confirmation Email</div>
                                                <div className="text-muted-foreground">
                                                    You'll receive a confirmation email with your booking details.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                                                2
                                            </div>
                                            <div>
                                                <div className="font-medium">Service Provider Contact</div>
                                                <div className="text-muted-foreground">
                                                    Our team will contact you within 24 hours to confirm the appointment details.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                                                3
                                            </div>
                                            <div>
                                                <div className="font-medium">Service Delivery</div>
                                                <div className="text-muted-foreground">
                                                    On the scheduled date, our professional will arrive at your location to provide the service.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-center">
                                <Button
                                    onClick={() => window.location.href = "/our-services"}
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full"
                                >
                                    Return to Services
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </WebsiteLayout>
    );
} 
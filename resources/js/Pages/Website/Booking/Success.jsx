import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Package, User, Mail, Phone, MapPin, FileText } from "lucide-react";
import WebsiteLayout from "@/Layouts/WebsiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@inertiajs/react";

export default function Success({ booking }) {
    return (
        <WebsiteLayout>
            <Head title="Booking Confirmation" />

            <div className="min-h-screen bg-background py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-6">
                                <div className="rounded-full bg-green-100 p-3">
                                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                                Booking Confirmed!
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Your booking has been successfully created. Here are your booking details:
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {/* Booking Summary */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Package className="h-6 w-6 text-primary" />
                                            <h2 className="text-2xl font-semibold">
                                                Booking Summary
                                            </h2>
                                        </div>

                                        <div className="grid gap-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Booking Number:</span>
                                                <span className="font-semibold">{booking.booking_number}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Status:</span>
                                                <span className="font-semibold capitalize">{booking.status}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Service:</span>
                                                <span className="font-semibold">{booking.service.name}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Category:</span>
                                                <span className="font-semibold">{booking.service.category}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Date:</span>
                                                <span className="font-semibold">{booking.booking_date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Selected Options */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Selected Options</h3>
                                        <div className="space-y-2">
                                            {booking.selected_options.map((option, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <span>
                                                        {option.label}
                                                        {option.quantity > 1 && ` (${option.quantity} units)`}
                                                    </span>
                                                    <span className="font-semibold">£{option.total}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-4 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span>Base Amount:</span>
                                                <span>£{booking.pricing.base_amount}</span>
                                            </div>
                                            {booking.pricing.discount_amount > 0 && (
                                                <div className="flex justify-between items-center text-green-600">
                                                    <span>Discount:</span>
                                                    <span>-£{booking.pricing.discount_amount}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center font-semibold border-t pt-2">
                                                <span>Final Amount:</span>
                                                <span>£{booking.pricing.final_amount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Customer Information */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 mb-6">
                                            <User className="h-6 w-6 text-primary" />
                                            <h2 className="text-2xl font-semibold">
                                                Customer Information
                                            </h2>
                                        </div>

                                        <div className="grid gap-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span>{booking.customer.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span>{booking.customer.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span>{booking.customer.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span>{booking.customer.address}</span>
                                            </div>
                                            {booking.notes && (
                                                <div className="flex items-start gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                                                    <span>{booking.notes}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-center gap-4">
                                <Button asChild variant="outline">
                                    <Link href={route('home')}>
                                        Return to Home
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href={route('services')}>
                                        Book Another Service
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </WebsiteLayout>
    );
} 
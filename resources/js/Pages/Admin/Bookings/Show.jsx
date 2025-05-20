import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import {
  Calendar,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/layouts/AdminLayout";

export default function BookingShow({ booking }) {
  console.log(booking);
  
  if (!booking) {
    return (
      <AdminLayout>
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight">Booking not found</h2>
        </div>
      </AdminLayout>
    );
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await router.post(
        route(`admin.bookings.${newStatus}`, booking.id),
        {},
        {
          onSuccess: () => {
            toast.success(`Booking ${newStatus} successfully`);
          },
          onError: () => {
            toast.error(`Failed to ${newStatus} booking`);
          },
        }
      );
    } catch (error) {
      toast.error(`An error occurred while updating the booking status`);
    }
  };

  return (
    <AdminLayout>
      <Head title={`Booking ${booking.booking_number || ''}`} />

      <div className="p-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Booking {booking.booking_number}
          </h2>
          <p className="text-muted-foreground">View booking details</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.visit(route("admin.bookings.edit", booking.id))}
          >
            Edit Booking
          </Button>
          {booking.status === "pending" && (
            <Button onClick={() => handleStatusChange("confirm")}>
              Confirm Booking
            </Button>
          )}
          {booking.status === "confirmed" && (
            <Button onClick={() => handleStatusChange("complete")}>
              Mark as Completed
            </Button>
          )}
          {["pending", "confirmed"].includes(booking.status) && (
            <Button
              variant="destructive"
              onClick={() => handleStatusChange("cancel")}
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Service</h4>
                <p>{booking.service?.name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-medium">Category</h4>
                <p>{booking.service?.category?.name || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="font-medium">Date</h4>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {booking.booking_date ? format(new Date(booking.booking_date), "PPP") : 'N/A'}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Duration</h4>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {booking.duration_hours ? `${booking.duration_hours} hours` : 'N/A'}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Frequency</h4>
                <Badge variant="outline">
                  {booking.frequency ? 
                    booking.frequency.charAt(0).toUpperCase() + 
                    booking.frequency.slice(1).replace("_", " ") : 
                    'N/A'
                  }
                </Badge>
              </div>
              <div>
                <h4 className="font-medium">Status</h4>
                <Badge
                  variant={
                    booking.status === "completed"
                      ? "success"
                      : booking.status === "cancelled"
                      ? "destructive"
                      : booking.status === "confirmed"
                      ? "default"
                      : "secondary"
                  }
                >
                  {booking.status ? 
                    booking.status.charAt(0).toUpperCase() + 
                    booking.status.slice(1) : 
                    'N/A'
                  }
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Name</h4>
                <div className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  {booking.customer_name || 'N/A'}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  {booking.customer_email || 'N/A'}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Phone</h4>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" />
                  {booking.customer_phone || 'N/A'}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Address</h4>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {booking.customer_address || 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Amount:</span>
                  <span>${booking.base_amount || 0}</span>
                </div>
                {(booking.frequency_discount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Frequency Discount:</span>
                    <span>-${booking.frequency_discount}</span>
                  </div>
                )}
                {(booking.bulk_discount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk Discount:</span>
                    <span>-${booking.bulk_discount}</span>
                  </div>
                )}
                {booking.coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({booking.coupon.code}):</span>
                    <span>-${booking.coupon_discount || 0}</span>
                  </div>
                )}
                {(booking.special_period_adjustment || 0) !== 0 && (
                  <div className="flex justify-between">
                    <span>Special Period Adjustment:</span>
                    <span
                      className={
                        booking.special_period_adjustment > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {booking.special_period_adjustment > 0 ? "+" : "-"}$
                      {Math.abs(booking.special_period_adjustment)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Final Amount:</span>
                  <span>${booking.final_amount || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {booking.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{booking.notes}</p>
              </CardContent>
            </Card>
          )}

          {booking.additional_services?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2">
                  {booking.additional_services.map((service, index) => (
                    <li key={index} className="text-muted-foreground">
                      {service}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 
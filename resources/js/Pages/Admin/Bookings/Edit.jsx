import { Head } from "@inertiajs/react";
import { BookingForm } from "./BookingForm";
import AdminLayout from "@/layouts/AdminLayout";

export default function BookingEdit({ booking, services }) {
  return (
    <AdminLayout>
      <Head title={`Edit Booking ${booking.booking_number}`} />

      <div className="p-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Edit Booking {booking.booking_number}
        </h2>
        <p className="text-muted-foreground">
          Update the booking details and preferences
        </p>
      </div>

      <div className="mt-8 p-4">
        <BookingForm services={services} initialData={booking} isEdit={true} />
      </div>
    </AdminLayout>
  );
} 
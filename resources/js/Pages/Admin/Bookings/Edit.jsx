import { Head } from "@inertiajs/react";
import { BookingForm } from "./BookingForm";
import AdminLayout from "../../../layouts/AdminLayout.jsx";

export default function BookingEdit({ booking, services }) {
  return (
    <AdminLayout>
      <Head title="Edit Booking" />

      <div className="p-4">
        <h2 className="text-2xl font-bold tracking-tight">Edit Booking</h2>
        <p className="text-muted-foreground">
          Update booking details
        </p>
      </div>

      <div className="mt-8 p-4">
        <BookingForm booking={booking} services={services} />
      </div>
    </AdminLayout>
  );
} 
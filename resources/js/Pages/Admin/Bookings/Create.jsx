import { Head } from "@inertiajs/react";
import { BookingForm } from "./BookingForm";
import AdminLayout from "../../../layouts/AdminLayout.jsx";

export default function BookingCreate({ services }) {
  return (
    <AdminLayout>
      <Head title="Create Booking" />

      <div className="p-4">
        <h2 className="text-2xl font-bold tracking-tight">Create Booking</h2>
        <p className="text-muted-foreground">
          Create a new booking for cleaning services
        </p>
      </div>

      <div className="mt-8 p-4">
        <BookingForm services={services} />
      </div>
    </AdminLayout>
  );
} 
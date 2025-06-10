import { Head, useForm } from "@inertiajs/react";
import { BookingForm } from "./BookingForm";
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import PropTypes from 'prop-types';

export default function BookingEdit({ booking, services }) {
  const { put, processing, errors } = useForm();

  const handleSubmit = (data) => {
    console.log('Submitting booking data:', data);
    put(route('admin.bookings.update', booking.id), data, {
      onSuccess: () => {
        console.log('Booking updated successfully');
      },
      onError: (errors) => {
        console.error('Booking update failed:', errors);
      },
    });
  };

  // Transform booking data to match form structure
  const initialData = booking ? {
    service_id: booking.service_id.toString(),
    selected_options: booking.service_options?.map(option => ({
      option_id: option.service_option_id.toString(),
      quantity: option.quantity || 1
    })) || [],
    booking_date: booking.booking_date,
    booking_time: booking.booking_time,
    customer_name: booking.customer_name,
    customer_email: booking.customer_email,
    customer_phone: booking.customer_phone,
    customer_address: booking.customer_address,
    notes: booking.notes || '',
    status: booking.status
  } : null;

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
        <BookingForm 
          services={services || []} 
          onSubmit={handleSubmit}
          isSubmitting={processing}
          initialData={initialData}
        />
      </div>
    </AdminLayout>
  );
}

BookingEdit.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    service_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    service_options: PropTypes.arrayOf(PropTypes.shape({
      service_option_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      quantity: PropTypes.number
    })),
    booking_date: PropTypes.string.isRequired,
    booking_time: PropTypes.string.isRequired,
    customer_name: PropTypes.string.isRequired,
    customer_email: PropTypes.string.isRequired,
    customer_phone: PropTypes.string.isRequired,
    customer_address: PropTypes.string.isRequired,
    notes: PropTypes.string,
    status: PropTypes.string.isRequired
  }).isRequired,
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
}; 
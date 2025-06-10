import { Head, useForm } from "@inertiajs/react";
import { BookingForm } from "./BookingForm";
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import PropTypes from 'prop-types';

export default function BookingCreate({ services }) {
  const { post, processing, errors } = useForm();

  const handleSubmit = (data) => {
    console.log('Submitting booking data:', data);
    post(route('admin.bookings.store' , data), {
      onSuccess: () => {
        console.log('Booking created successfully');
      },
      onError: (errors) => {
        console.error('Booking creation failed:', errors);
      },
    });
  };

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
        <BookingForm 
          services={services || []} 
          onSubmit={handleSubmit}
          isSubmitting={processing}
        />
      </div>
    </AdminLayout>
  );
}

BookingCreate.propTypes = {
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
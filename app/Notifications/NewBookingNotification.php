<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $message = new MailMessage;
        $message->subject('New Booking Received - ' . $this->booking->booking_number)
            ->greeting('Hello Admin!')
            ->line('A new booking has been received and requires your attention.')
            ->line('Booking Details:')
            ->line('Booking Number: ' . $this->booking->booking_number)
            ->line('Service: ' . $this->booking->service->name)
            ->line('Date: ' . $this->booking->booking_date->format('F j, Y'))
            ->line('Total Amount: £' . number_format($this->booking->final_amount, 2));

        if ($this->booking->coupon) {
            $message->line('Applied Coupon: ' . $this->booking->coupon->code);
        }

        $message->line('Customer Information:')
            ->line('Name: ' . $this->booking->customer_name)
            ->line('Email: ' . $this->booking->customer_email)
            ->line('Phone: ' . $this->booking->customer_phone)
            ->line('Address: ' . $this->booking->customer_address);

        if ($this->booking->notes) {
            $message->line('Additional Notes: ' . $this->booking->notes);
        }

        $message->action('View Booking Details', route('admin.bookings.show', $this->booking))
            ->line('Please review and confirm this booking.');

        return $message;
    }
} 
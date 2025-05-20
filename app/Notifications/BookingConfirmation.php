<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Booking;

class BookingConfirmation extends Notification implements ShouldQueue
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
        $message->subject('Booking Confirmation - ' . $this->booking->booking_number)
            ->greeting('Hello ' . $this->booking->customer_name . '!')
            ->line('Thank you for choosing Union Gate. Your booking has been received.')
            ->line('Booking Details:')
            ->line('Service: ' . $this->booking->service->name)
            ->line('Date: ' . $this->booking->booking_date->format('F j, Y'))
            ->line('Duration: ' . $this->booking->duration_hours . ' hours')
            ->line('Address: ' . $this->booking->customer_address)
            ->line('Total Amount: $' . number_format($this->booking->final_amount, 2));

        if ($this->booking->coupon) {
            $message->line('Applied Coupon: ' . $this->booking->coupon->code);
        }

        $message->line('Status: ' . ucfirst($this->booking->status))
            ->line('We will review your booking and confirm it shortly.')
            ->action('View Booking Details', route('website.booking.confirmation', $this->booking))
            ->line('If you have any questions, please don\'t hesitate to contact us.');

        return $message;
    }
} 
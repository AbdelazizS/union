<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingReminderNotification extends Notification implements ShouldQueue
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
        return (new MailMessage)
            ->subject('Reminder: Your Booking Tomorrow - ' . $this->booking->booking_number)
            ->greeting('Hello ' . $this->booking->customer_name . '!')
            ->line('This is a friendly reminder about your booking tomorrow.')
            ->line('Booking Details:')
            ->line('Service: ' . $this->booking->service->name)
            ->line('Date: ' . $this->booking->booking_date->format('F j, Y'))
            ->line('Address: ' . $this->booking->customer_address)
            ->line('Please ensure someone will be available at the location during the service time.')
            ->action('View Booking Details', route('website.booking.confirmation', $this->booking))
            ->line('If you need to make any changes, please contact us as soon as possible.')
            ->line('Thank you for choosing our services!');
    }
} 
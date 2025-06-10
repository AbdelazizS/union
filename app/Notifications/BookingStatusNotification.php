<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $booking;
    protected $oldStatus;

    public function __construct(Booking $booking, $oldStatus)
    {
        $this->booking = $booking;
        $this->oldStatus = $oldStatus;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $statusMessages = [
            'confirmed' => 'Your booking has been confirmed!',
            'completed' => 'Your service has been completed. Thank you for choosing us!',
            'cancelled' => 'Your booking has been cancelled.',
            'rescheduled' => 'Your booking has been rescheduled.'
        ];

        $message = new MailMessage;
        $message->subject('Booking Status Update - ' . $this->booking->booking_number)
            ->greeting('Hello ' . $this->booking->customer_name . '!')
            ->line($statusMessages[$this->booking->status] ?? 'Your booking status has been updated.')
            ->line('Booking Details:')
            ->line('Service: ' . $this->booking->service->name)
            ->line('Date: ' . $this->booking->booking_date->format('F j, Y'))
            ->line('Status: ' . ucfirst($this->booking->status));

        if ($this->booking->status === 'confirmed') {
            $message->action('View Booking Details', route('website.booking.confirmation', $this->booking));
        }

        return $message->line('Thank you for choosing our services!');
    }
} 
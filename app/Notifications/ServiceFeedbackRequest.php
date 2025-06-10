<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ServiceFeedbackRequest extends Notification implements ShouldQueue
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
            ->subject('How Was Your Service? - ' . $this->booking->booking_number)
            ->greeting('Hello ' . $this->booking->customer_name . '!')
            ->line('Thank you for choosing our services. We hope you were satisfied with the service provided.')
            ->line('We would greatly appreciate your feedback to help us improve our services.')
            ->line('Service Details:')
            ->line('Service: ' . $this->booking->service->name)
            ->line('Date: ' . $this->booking->booking_date->format('F j, Y'))
            // ->action('Leave Your Feedback', route('website.feedback.create', [
            //     'booking' => $this->booking,
            //     'token' => encrypt($this->booking->id)
            // ]))
            ->line('Your feedback helps us maintain our high standards and improve where needed.')
            ->line('Thank you for your time!');
    }
} 
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactFormNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $formData;

    public function __construct($formData)
    {
        $this->formData = $formData;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Contact Form Submission')
            ->line('You have received a new contact form submission.')
            ->line('Name: ' . $this->formData['name'])
            ->line('Email: ' . $this->formData['email'])
            ->line('Message: ' . $this->formData['message'])
            ->line('Thank you for using our application!');
    }
} 
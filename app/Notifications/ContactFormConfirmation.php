<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactFormConfirmation extends Notification
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
            ->subject('Thank You for Contacting Us')
            ->greeting('Hello ' . $this->formData['name'] . ',')
            ->line('Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.')
            ->line('Here is a copy of your message:')
            ->line($this->formData['message'])
            ->line('If you have any additional questions, please don\'t hesitate to contact us.')
            ->line('Best regards,')
            ->line(config('app.name'));
    }
} 
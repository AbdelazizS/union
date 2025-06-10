<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class ContactFormNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $tries = 3;
    public $timeout = 30;
    public $maxExceptions = 3;

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
        try {
            Log::info('Preparing contact form notification email', [
                'recipient' => $notifiable->email,
                'form_data' => $this->formData
            ]);

            $message = (new MailMessage)
                ->subject('New Contact Form Submission')
                ->line('You have received a new contact form submission.')
                ->line('Name: ' . $this->formData['name'])
                ->line('Email: ' . $this->formData['email'])
                ->line('Phone: ' . $this->formData['phone'])
                ->line('Subject: ' . ($this->formData['subject'] ?? 'Not specified'))
                ->line('Message: ' . $this->formData['message'])
                ->line('Thank you for using our application!');

            Log::info('Contact form notification email prepared successfully');
            return $message;
        } catch (\Exception $e) {
            Log::error('Error preparing contact form notification email', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function failed(\Throwable $exception)
    {
        Log::error('Contact form notification failed', [
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
            'form_data' => $this->formData
        ]);
    }
} 
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactFormConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $formData;

    public function __construct($formData)
    {
        $this->formData = $formData;
    }

    public function build()
    {
        return $this->subject('Thank You for Contacting Us')
            ->view('emails.contact-confirmation')
            ->with([
                'name' => $this->formData['name'],
                'message' => $this->formData['message']
            ]);
    }
} 
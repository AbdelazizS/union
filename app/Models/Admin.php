<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;

class Admin
{
    use Notifiable;

    protected $email;

    public function __construct($email)
    {
        $this->email = $email;
    }

    public function routeNotificationForMail()
    {
        return $this->email;
    }
} 
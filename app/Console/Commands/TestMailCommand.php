<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;

class TestMailCommand extends Command
{
    protected $signature = 'mail:test {email : The email address to send the test to}';
    protected $description = 'Send a test email to verify mail configuration';

    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("Sending test email to {$email}...");
        
        try {
            Mail::raw('This is a test email from your Laravel application.', function (Message $message) use ($email) {
                $message->to($email)
                    ->subject('Test Email');
            });
            
            $this->info('Test email sent successfully!');
        } catch (\Exception $e) {
            $this->error('Failed to send test email:');
            $this->error($e->getMessage());
        }
    }
} 
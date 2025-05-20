<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Notifications\BookingReminderNotification;
use Illuminate\Console\Command;
use Carbon\Carbon;

class SendBookingReminders extends Command
{
    protected $signature = 'bookings:send-reminders';
    protected $description = 'Send reminder notifications for bookings scheduled for tomorrow';

    public function handle()
    {
        $tomorrow = Carbon::tomorrow();
        
        $bookings = Booking::query()
            ->where('status', 'confirmed')
            ->whereDate('booking_date', $tomorrow)
            ->get();
            
        $this->info("Found {$bookings->count()} bookings for tomorrow.");
        
        foreach ($bookings as $booking) {
            try {
                $booking->notify(new BookingReminderNotification($booking));
                $this->info("Sent reminder for booking {$booking->booking_number}");
            } catch (\Exception $e) {
                $this->error("Failed to send reminder for booking {$booking->booking_number}: {$e->getMessage()}");
            }
        }
        
        $this->info('Reminder sending completed.');
    }
} 
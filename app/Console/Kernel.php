<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        \App\Console\Commands\TestMailCommand::class,
        \App\Console\Commands\SendBookingReminders::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * These schedules are run in the background and are not visible to the user.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule): void
    {
        // Send booking reminders daily at 9 AM
        $schedule->command('bookings:send-reminders')
                ->dailyAt('09:00')
                ->withoutOverlapping();

        // Generate sitemap daily
        $schedule->command('sitemap:generate')->daily();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
} 
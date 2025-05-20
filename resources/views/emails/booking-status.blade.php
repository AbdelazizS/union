@component('mail::message')
{{-- Status Badge --}}
<div style="text-align: center; margin-bottom: 24px;">
    @php
        $statusColors = [
            'confirmed' => ['bg' => '#ECFDF5', 'text' => '#065F46'],
            'completed' => ['bg' => '#F0F9FF', 'text' => '#0C4A6E'],
            'cancelled' => ['bg' => '#FEF2F2', 'text' => '#991B1B'],
            'rescheduled' => ['bg' => '#FFF7ED', 'text' => '#9A3412'],
        ];
        $statusMessages = [
            'confirmed' => 'Booking Confirmed',
            'completed' => 'Service Completed',
            'cancelled' => 'Booking Cancelled',
            'rescheduled' => 'Booking Rescheduled',
        ];
        $colors = $statusColors[$booking->status] ?? ['bg' => '#F8FAFC', 'text' => '#475569'];
        $message = $statusMessages[$booking->status] ?? 'Status Updated';
    @endphp
    <span style="background-color: {{ $colors['bg'] }}; color: {{ $colors['text'] }}; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
        {{ $message }}
    </span>
</div>

{{-- Main Content --}}
<h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
    Booking Status Update
</h1>

<p style="color: #475569; margin-bottom: 24px; text-align: center;">
    @php
        $statusDescriptions = [
            'confirmed' => 'Great news! Your booking has been confirmed and is ready to go.',
            'completed' => 'Your service has been completed. Thank you for choosing Union Gate!',
            'cancelled' => 'Your booking has been cancelled. We hope to serve you again in the future.',
            'rescheduled' => 'Your booking has been rescheduled. Please review the updated details below.',
        ];
    @endphp
    {{ $statusDescriptions[$booking->status] ?? 'Your booking status has been updated.' }}
</p>

{{-- Booking Details Card --}}
<div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        Booking Details
    </h2>
    
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Booking Number:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->booking_number }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Service:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->service->name }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Date:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->booking_date->format('F j, Y') }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Duration:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->duration_hours }} hours</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Location:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->customer_address }}</td>
        </tr>
    </table>
</div>

@if($booking->status === 'confirmed')
{{-- Next Steps for Confirmed Bookings --}}
<div style="margin-bottom: 32px;">
    <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        What's Next?
    </h2>
    <ol style="color: #475569; margin: 0; padding-left: 24px;">
        <li style="margin-bottom: 8px;">We'll send you a reminder 24 hours before your service</li>
        <li style="margin-bottom: 8px;">Our team will arrive at the scheduled time</li>
        <li style="margin-bottom: 8px;">After the service, we'll request your feedback</li>
    </ol>
</div>
@endif

@if($booking->status === 'completed')
{{-- Feedback Request for Completed Bookings --}}
<div style="text-align: center; margin: 32px 0;">
    <p style="color: #475569; margin-bottom: 16px;">
        We'd love to hear about your experience!
    </p>
    @component('mail::button', ['url' => route('website.feedback.create', ['booking' => $booking, 'token' => encrypt($booking->id)]), 'color' => 'success'])
    Leave Feedback
    @endcomponent
</div>
@endif

@if($booking->status !== 'cancelled')
@component('mail::button', ['url' => route('website.booking.confirmation', $booking), 'color' => 'primary'])
View Booking Details
@endcomponent
@endif

<p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
    @if($booking->status === 'cancelled')
    Need to make a new booking? Visit our website or contact our support team.
    @else
    If you have any questions, please don't hesitate to contact our support team.
    @endif
</p>

@endcomponent 
@component('mail::message')
{{-- Reminder Badge --}}
<div style="text-align: center; margin-bottom: 24px;">
    <span style="background-color: #FEF3C7; color: #92400E; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
        Reminder
    </span>
</div>

{{-- Main Content --}}
<h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
    Your Service is Tomorrow!
</h1>

<p style="color: #475569; margin-bottom: 24px; text-align: center;">
    This is a friendly reminder about your scheduled service tomorrow. Please ensure someone will be available at the location during the service time.
</p>

{{-- Booking Details Card --}}
<div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        Service Details
    </h2>
    
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Service:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->service->name }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Date:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->booking_date->format('F j, Y') }}</td>
        </tr>
        <!-- <tr>
            <td style="padding: 8px 0; color: #64748b;">Duration:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->duration_hours }} hours</td>
        </tr> -->
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Location:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->customer_address }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Total Amount:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">£{{ number_format($booking->final_amount, 2) }}</td>
        </tr>
    </table>
</div>

{{-- Preparation Checklist --}}
<div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        Preparation Checklist
    </h2>
    
    <ul style="color: #475569; margin: 0; padding-left: 24px;">
        <li style="margin-bottom: 8px;">Ensure the service area is accessible</li>
        <li style="margin-bottom: 8px;">Remove any valuable or fragile items</li>
        <li style="margin-bottom: 8px;">Secure any pets if applicable</li>
        <li style="margin-bottom: 8px;">Have payment ready if required</li>
    </ul>
</div>

{{-- Important Notes --}}
<div style="background-color: #FEF2F2; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #991B1B; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        Important Notes
    </h2>
    
    <ul style="color: #991B1B; margin: 0; padding-left: 24px;">
        <li style="margin-bottom: 8px;">Our team will arrive at the scheduled time</li>
        <li style="margin-bottom: 8px;">Please ensure someone is present to provide access</li>
        <li style="margin-bottom: 8px;">Contact us immediately if you need to reschedule</li>
    </ul>
</div>

@component('mail::button', ['url' => route('website.booking.confirmation', $booking), 'color' => 'primary'])
View Booking Details
@endcomponent

<p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
    Need to make changes? Please contact our support team as soon as possible.
</p>

@endcomponent 
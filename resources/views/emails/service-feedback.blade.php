@component('mail::message')
{{-- Feedback Badge --}}
<div style="text-align: center; margin-bottom: 24px;">
    <span style="background-color: #F0F9FF; color: #0C4A6E; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
        Feedback Request
    </span>
</div>

{{-- Main Content --}}
<h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
    How Was Your Experience?
</h1>

<p style="color: #475569; margin-bottom: 24px; text-align: center;">
    Thank you for choosing Union Gate! We hope you were satisfied with our service. Your feedback helps us maintain our high standards and improve where needed.
</p>

{{-- Service Details Card --}}
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

{{-- Feedback Areas --}}
<div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        We'd Love Your Feedback On:
    </h2>
    
    <ul style="color: #475569; margin: 0; padding-left: 24px;">
        <li style="margin-bottom: 8px;">Service quality and thoroughness</li>
        <li style="margin-bottom: 8px;">Staff professionalism and courtesy</li>
        <li style="margin-bottom: 8px;">Timeliness and punctuality</li>
        <li style="margin-bottom: 8px;">Overall satisfaction</li>
    </ul>
</div>

{{-- Action Button --}}
<div style="text-align: center; margin: 32px 0;">
    @component('mail::button', ['url' => route('website.feedback.create', ['booking' => $booking, 'token' => encrypt($booking->id)]), 'color' => 'success'])
    Share Your Feedback
    @endcomponent
</div>

{{-- Incentive Message --}}
<div style="background-color: #ECFDF5; border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;">
    <h3 style="color: #065F46; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
        Special Offer!
    </h3>
    <p style="color: #065F46; margin: 0;">
        Get 10% off your next booking when you complete this feedback form!
    </p>
</div>

<p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
    Your feedback is valuable to us and helps us serve you better.
</p>

@endcomponent 
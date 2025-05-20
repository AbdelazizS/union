@component('mail::message')
{{-- Status Badge --}}
<div style="text-align: center; margin-bottom: 24px;">
    <span style="background-color: #FEF3C7; color: #92400E; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
        Pending Confirmation
    </span>
</div>

{{-- Main Content --}}
<h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
    Thank You for Your Booking!
</h1>

<p style="color: #475569; margin-bottom: 24px; text-align: center;">
    We've received your booking request and will confirm it shortly.
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

{{-- Price Breakdown Card --}}
<div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        Price Breakdown
    </h2>
    
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Base Amount:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">${{ number_format($booking->base_amount, 2) }}</td>
        </tr>
        @if($booking->frequency_discount > 0)
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Frequency Discount:</td>
            <td style="padding: 8px 0; color: #059669; font-weight: 500; text-align: right;">-${{ number_format($booking->frequency_discount, 2) }}</td>
        </tr>
        @endif
        @if($booking->coupon_discount > 0)
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Coupon Discount:</td>
            <td style="padding: 8px 0; color: #059669; font-weight: 500; text-align: right;">-${{ number_format($booking->coupon_discount, 2) }}</td>
        </tr>
        @endif
        <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 12px 0; color: #334155; font-weight: 600;">Total Amount:</td>
            <td style="padding: 12px 0; color: #334155; font-weight: 600; text-align: right;">${{ number_format($booking->final_amount, 2) }}</td>
        </tr>
    </table>
</div>

{{-- Next Steps --}}
<div style="margin-bottom: 32px;">
    <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        Next Steps
    </h2>
    <ol style="color: #475569; margin: 0; padding-left: 24px;">
        <li style="margin-bottom: 8px;">We'll review your booking details</li>
        <li style="margin-bottom: 8px;">You'll receive a confirmation email once approved</li>
        <li style="margin-bottom: 8px;">We'll send a reminder 24 hours before your service</li>
    </ol>
</div>

@component('mail::button', ['url' => route('website.booking.confirmation', $booking), 'color' => 'primary'])
View Booking Details
@endcomponent

<p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
    If you have any questions, please don't hesitate to contact our support team.
</p>

@endcomponent 
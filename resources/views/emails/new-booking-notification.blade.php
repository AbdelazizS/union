@component('mail::message')
{{-- Alert Badge --}}
<div style="text-align: center; margin-bottom: 24px;">
    <span style="background-color: #FEE2E2; color: #991B1B; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
        Action Required
    </span>
</div>

{{-- Main Content --}}
<h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
    New Booking Request
</h1>

<p style="color: #475569; margin-bottom: 24px; text-align: center;">
    A new booking request has been received and requires your review.
</p>

{{-- Booking Details Card --}}
<div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        Booking Information
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
            <td style="padding: 8px 0; color: #64748b;">Amount:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">${{ number_format($booking->final_amount, 2) }}</td>
        </tr>
        @if($booking->coupon)
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Applied Coupon:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->coupon->code }}</td>
        </tr>
        @endif
    </table>
</div>

{{-- Customer Information Card --}}
<div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        Customer Information
    </h2>
    
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Name:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->customer_name }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Email:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->customer_email }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Phone:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->customer_phone }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Address:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $booking->customer_address }}</td>
        </tr>
    </table>

    @if($booking->notes)
    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <h3 style="color: #334155; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
            Additional Notes
        </h3>
        <p style="color: #475569; margin: 0;">{{ $booking->notes }}</p>
    </div>
    @endif
</div>

{{-- Action Buttons --}}
<div style="text-align: center; margin-bottom: 32px;">
    @component('mail::button', ['url' => route('admin.bookings.show', $booking), 'color' => 'primary'])
    Review Booking
    @endcomponent
</div>

<p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
    Please review and confirm this booking as soon as possible.
</p>

@endcomponent 
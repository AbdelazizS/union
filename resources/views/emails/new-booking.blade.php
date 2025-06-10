<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            {{-- Company Header --}}
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #1e293b; font-size: 28px; font-weight: 700; margin: 0;">Union Gate</h1>
                <p style="color: #64748b; margin-top: 8px; font-size: 16px;">Booking Management System</p>
            </div>

            {{-- Alert Header --}}
            <div style="text-align: center; margin-bottom: 32px;">
                <h2 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0;">New Booking Alert!</h2>
                <p style="color: #64748b; margin-top: 8px;">A new booking has been received and requires your attention.</p>
            </div>

            {{-- Booking Summary Card --}}
            <div style="background-color: #f1f5f9; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">Booking Details</h2>
                <div style="color: #475569;">
                    <p style="margin: 8px 0;"><strong style="color: #334155;">Booking Number:</strong> {{ $booking->booking_number }}</p>
                    <p style="margin: 8px 0;"><strong style="color: #334155;">Service:</strong> {{ $booking->service->name }}</p>
                    <p style="margin: 8px 0;"><strong style="color: #334155;">Date:</strong> {{ $booking->booking_date->format('F j, Y') }}</p>
                    <!-- <p style="margin: 8px 0;"><strong style="color: #334155;">Duration:</strong> {{ $booking->duration_hours }} hours</p> -->
                    <p style="margin: 8px 0;"><strong style="color: #334155;">Total Amount:</strong> £{{ number_format($booking->final_amount, 2) }}</p>
                    @if($booking->coupon)
                        <p style="margin: 8px 0;"><strong style="color: #334155;">Coupon Applied:</strong> {{ $booking->coupon->code }}</p>
                    @endif
                </div>
            </div>

            {{-- Customer Information Card --}}
            <div style="background-color: #f1f5f9; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">Customer Information</h2>
                <div style="color: #475569;">
                    <p style="margin: 8px 0;"><strong style="color: #334155;">Name:</strong> {{ $booking->customer_name }}</p>
                    <p style="margin: 8px 0;"><strong style="color: #334155;">Email:</strong> {{ $booking->customer_email }}</p>
                    <p style="margin: 8px 0;"><strong style="color: #334155;">Phone:</strong> {{ $booking->customer_phone }}</p>
                    <p style="margin: 8px 0;"><strong style="color: #334155;">Address:</strong> {{ $booking->customer_address }}</p>
                    @if($booking->notes)
                        <p style="margin: 8px 0;"><strong style="color: #334155;">Additional Notes:</strong> {{ $booking->notes }}</p>
                    @endif
                </div>
            </div>

            {{-- Action Button --}}
            <div style="text-align: center; margin: 32px 0;">
                <a href="{{ route('admin.bookings.show', $booking) }}" 
                   style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                    View Booking Details
                </a>
            </div>

            {{-- Footer --}}
            <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 4px 0;">Please review and confirm this booking.</p>
                <p style="margin: 4px 0;">© {{ date('Y') }} Union Gate. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html> 
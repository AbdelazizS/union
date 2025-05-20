<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Email</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f7fafc;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background-color: #2b6cb0;
            color: white;
            padding: 24px;
            text-align: center;
        }
        .content {
            padding: 24px;
            background-color: #ffffff;
        }
        .footer {
            text-align: center;
            padding: 16px;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            color: #4a5568;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4299e1;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 16px 0;
        }
        .info-box {
            background-color: #ebf8ff;
            border: 1px solid #bee3f8;
            border-radius: 6px;
            padding: 16px;
            margin: 16px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Our Service</h1>
        </div>
        
        <div class="content">
            <p>Hello,</p>
            
            <p>Thank you for testing our email system. This is a verification email to ensure our communication channels are working properly.</p>
            
            @if(isset($data) && !empty($data))
                <div class="info-box">
                    <h3 style="margin-top: 0; color: #2b6cb0;">Test Information</h3>
                    <p style="margin-bottom: 0;">
                        <strong>Time:</strong> {{ $data['timestamp'] ?? 'N/A' }}<br>
                        <strong>User:</strong> {{ $data['user'] ?? 'N/A' }}
                    </p>
                </div>
            @endif
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p style="margin-top: 24px;">
                Best regards,<br>
                <strong>The Support Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0;">This is an automated message from our system.</p>
            <p style="margin: 8px 0 0 0;">© {{ date('Y') }} Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html> 
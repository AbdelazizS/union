<!DOCTYPE html>
<html>
<head>
    <title>Thank You for Contacting Us</title>
</head>
<body>
    <h2>Hello {{ $name }},</h2>
    
    <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
    
    <p>Here is a copy of your message:</p>
    <div style="background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
        {{ $message }}
    </div>
    
    <p>If you have any additional questions, please don't hesitate to contact us.</p>
    
    <p>Best regards,<br>
    {{ config('app.name') }}</p>
</body>
</html> 
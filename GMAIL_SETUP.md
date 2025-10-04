# Gmail Email Setup - Use Your Existing Gmail Credentials

## Quick Setup with Your Gmail Credentials

Since you already have Gmail user ID and key in your `.env` file, here's how to configure the email service to use them:

### Step 1: Update Your .env File

Add these lines to your `.env` file (or create `.env.local` if you don't have one):

```env
# Enable Gmail API for email sending
REACT_APP_EMAIL_PROVIDER=gmail-api

# Your existing Gmail credentials
REACT_APP_GMAIL_USER=your_gmail_user_id
REACT_APP_GMAIL_KEY=your_gmail_key

# Optional: Set your company name
REACT_APP_FROM_NAME=Performance Management System
```

### Step 2: Restart Your Development Server

```bash
# Stop current server (Ctrl+C)
npm start
```

### Step 3: Test Email Sending

1. Go to the RequestFeedback page
2. Select colleagues to send feedback requests to
3. Add a personal message (optional)
4. Click "Send Feedback Requests"
5. Check your email - you should receive real emails!

## What You Should See

### In Browser Console:
```
=== Email Service Test ===
Current provider: gmail-api
✅ Email service is configured for real sending
Provider: gmail-api
```

### When Sending Emails:
```
📧 Email sent via Gmail API: {
  to: "colleague@example.com",
  subject: "Feedback Request for Q1 2024",
  messageId: "gmail_1234567890",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

## Troubleshooting

### If Emails Still Don't Send:

1. **Check Console Errors**: Look for specific error messages in browser console
2. **Verify Credentials**: Make sure your Gmail user ID and key are correct
3. **Check Gmail API Access**: Ensure your Gmail account has API access enabled
4. **OAuth Token**: If using OAuth, make sure your token is valid and not expired

### Common Issues:

- **"Gmail API error: 401"**: Invalid or expired credentials
- **"Gmail API error: 403"**: Gmail API not enabled or insufficient permissions
- **"Gmail credentials not configured"**: Missing REACT_APP_GMAIL_USER or REACT_APP_GMAIL_KEY

### Gmail API Requirements:

- Your Gmail account must have API access enabled
- If using OAuth 2.0, the token must be valid
- The Gmail API must be enabled in Google Cloud Console
- Your application must be authorized to send emails

## Alternative: If Gmail API Doesn't Work

If you encounter issues with Gmail API, you can also try:

### Option 1: EmailJS (Easier Setup)
```env
REACT_APP_EMAIL_PROVIDER=emailjs-api
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

### Option 2: SendGrid (Professional)
```env
REACT_APP_EMAIL_PROVIDER=sendgrid-api
REACT_APP_SENDGRID_API_KEY=your_sendgrid_api_key
REACT_APP_FROM_EMAIL=your_verified_email@domain.com
```

## Need Help?

1. Check the browser console for specific error messages
2. Verify your Gmail credentials are working
3. Make sure the Gmail API is properly configured
4. Try one of the alternative email services if needed

Your email functionality should now work with your existing Gmail credentials! 🎉

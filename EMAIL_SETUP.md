# Email Setup Guide

The RequestFeedback feature now supports real email sending! Follow these instructions to configure email functionality.

## Quick Setup Options

### Option 1: SendGrid (Recommended for Production)

1. **Sign up for SendGrid**
   - Go to https://sendgrid.com
   - Create a free account (100 emails/day free)

2. **Create API Key**
   - Go to Settings > API Keys in your SendGrid dashboard
   - Click "Create API Key"
   - Choose "Restricted Access" and give it "Mail Send" permissions
   - Copy the API key

3. **Configure Environment Variables**
   Create a `.env.local` file in your project root:
   ```env
   REACT_APP_EMAIL_PROVIDER=sendgrid-api
   REACT_APP_SENDGRID_API_KEY=your_sendgrid_api_key_here
   REACT_APP_FROM_EMAIL=your_verified_email@yourdomain.com
   REACT_APP_FROM_NAME=Your Company Name
   ```

4. **Verify Your Email**
   - In SendGrid, go to Settings > Sender Authentication
   - Verify your sender email address

### Option 2: EmailJS (Browser-Compatible, Great for Development)

1. **Sign up for EmailJS**
   - Go to https://www.emailjs.com
   - Create a free account (200 emails/month free)

2. **Create Email Service**
   - Go to Email Services in your dashboard
   - Add a service (Gmail, Outlook, Yahoo, etc.)
   - Connect your email account

3. **Create Email Template**
   - Go to Email Templates
   - Create a new template with variables like:
     - `{{to_email}}` - recipient email
     - `{{to_name}}` - recipient name
     - `{{subject}}` - email subject
     - `{{message}}` - email content
     - `{{from_name}}` - sender name

4. **Get Configuration Values**
   - Service ID: From Email Services page
   - Template ID: From Email Templates page
   - Public Key: From Account > API Keys

5. **Configure Environment Variables**
   Create a `.env.local` file in your project root:
   ```env
   REACT_APP_EMAIL_PROVIDER=emailjs-api
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
   REACT_APP_FROM_NAME=Your Company Name
   ```

### Option 3: Simulated (Development Only)

No setup required! Emails will be simulated and logged to the browser console.

## Testing Email Functionality

1. **Start the application**
   ```bash
   npm start
   ```

2. **Navigate to RequestFeedback page**
   - Go to Performance Management
   - Select an employee and quarter
   - Click "Request Feedback"

3. **Send a test email**
   - Search and select colleagues
   - Add a personal message (optional)
   - Click "Send Feedback Requests"

4. **Check results**
   - Look for success/failure messages
   - Check browser console for detailed logs
   - Verify emails were received (if using real email service)

## Troubleshooting

### SendGrid Issues
- **"Unauthorized" error**: Check your API key
- **"Forbidden" error**: Verify your sender email address
- **Emails not received**: Check spam folder, verify sender authentication

### Gmail/Nodemailer Issues
- **"Invalid credentials"**: Use app password, not regular password
- **"Less secure app" error**: Enable 2-factor auth and use app password
- **Rate limiting**: Gmail has daily sending limits

### General Issues
- **Environment variables not loading**: Restart the development server
- **Module not found**: Run `npm install` to ensure dependencies are installed
- **CORS errors**: Email sending happens client-side, some services may block this

## Production Considerations

1. **Use a backend service** for production email sending
2. **Implement rate limiting** to prevent abuse
3. **Add email templates** for different types of notifications
4. **Set up email tracking** to monitor delivery rates
5. **Configure SPF/DKIM records** for better deliverability

## Security Notes

- Never commit `.env.local` files to version control
- Use environment-specific API keys
- Rotate API keys regularly
- Monitor email sending for unusual activity

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Test with a simple email first
4. Check your email service provider's documentation

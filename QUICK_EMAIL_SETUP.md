# Quick Email Setup - Get Real Emails Working in 5 Minutes!

## Current Status
Your app is currently in "simulated" mode - emails are only logged to the browser console, not actually sent.

## Quick Fix - Enable Real Email Sending

### Step 1: Create Environment File
Create a file called `.env.local` in your project root (same folder as package.json) with this content:

```env
# Enable real email sending
REACT_APP_EMAIL_PROVIDER=emailjs-api

# EmailJS Configuration (you'll get these from EmailJS)
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here

# General settings
REACT_APP_FROM_NAME=Performance Management System
```

### Step 2: Set Up EmailJS (Free - 200 emails/month)

1. **Sign up**: Go to https://www.emailjs.com and create a free account

2. **Create Email Service**:
   - Go to "Email Services" in your dashboard
   - Click "Add New Service"
   - Choose Gmail, Outlook, or Yahoo
   - Connect your email account
   - Copy the "Service ID" (starts with "service_")

3. **Create Email Template**:
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use this template content:
   ```
   Subject: {{subject}}
   
   Hi {{to_name}},
   
   {{from_name}} has requested your feedback for their performance review.
   
   Personal Message:
   {{message}}
   
   Please provide your feedback at your earliest convenience.
   
   Best regards,
   {{from_name}}
   ```
   - Save and copy the "Template ID" (starts with "template_")

4. **Get Public Key**:
   - Go to "Account" > "General"
   - Copy your "Public Key"

### Step 3: Update .env.local
Replace the placeholder values in your `.env.local` file:
```env
REACT_APP_EMAIL_PROVIDER=emailjs-api
REACT_APP_EMAILJS_SERVICE_ID=service_abc123  # Your actual service ID
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789  # Your actual template ID
REACT_APP_EMAILJS_PUBLIC_KEY=user_abc123def456  # Your actual public key
REACT_APP_FROM_NAME=Performance Management System
```

### Step 4: Restart Your App
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

### Step 5: Test Email Sending
1. Go to the RequestFeedback page
2. Select some colleagues
3. Add a message
4. Click "Send Feedback Requests"
5. Check your email - you should receive real emails!

## Alternative: SendGrid (More Professional)

If you prefer SendGrid (more professional, higher limits):

```env
REACT_APP_EMAIL_PROVIDER=sendgrid-api
REACT_APP_SENDGRID_API_KEY=your_sendgrid_api_key
REACT_APP_FROM_EMAIL=your_verified_email@domain.com
REACT_APP_FROM_NAME=Your Company Name
```

## Troubleshooting

### Emails Still Not Sending?
1. Check browser console for error messages
2. Verify your `.env.local` file is in the project root
3. Restart the development server after creating `.env.local`
4. Check that your EmailJS service is connected and template is saved

### Console Shows "Simulated"?
- Make sure `REACT_APP_EMAIL_PROVIDER=emailjs-api` is in your `.env.local`
- Restart the development server

### CORS Errors?
- EmailJS handles CORS automatically
- If using SendGrid, you might need to configure CORS on your backend

## Current Status Check
After setup, you should see in the browser console:
- "Using EmailJS API via fetch" (instead of "simulated")
- "📧 Email sent via EmailJS API" (instead of "simulated")

## Need Help?
1. Check the browser console for specific error messages
2. Verify all EmailJS credentials are correct
3. Make sure your email service is connected in EmailJS dashboard

// Email configuration for the application
// Copy this file to .env.local and fill in your actual values

export const emailConfig = {
  // Email provider options: 'gmail-api', 'sendgrid-api', 'emailjs-api', 'simulated'
  provider: process.env.REACT_APP_EMAIL_PROVIDER || 'simulated',
  
  // Gmail API configuration (browser-compatible)
  gmail: {
    user: process.env.REACT_APP_GMAIL_USER,
    key: process.env.REACT_APP_GMAIL_KEY,
  },
  
  // SendGrid API configuration (browser-compatible)
  sendgrid: {
    apiKey: process.env.REACT_APP_SENDGRID_API_KEY,
  },
  
  // EmailJS API configuration (browser-compatible)
  emailjs: {
    serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
    templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
  },
  
  // General email settings
  fromEmail: process.env.REACT_APP_FROM_EMAIL || 'noreply@yourcompany.com',
  fromName: process.env.REACT_APP_FROM_NAME || 'Performance Management System',
};

// Instructions for setting up email services
export const emailSetupInstructions = {
  gmail: {
    steps: [
      '1. Go to Google Cloud Console (https://console.cloud.google.com)',
      '2. Create a new project or select existing one',
      '3. Enable Gmail API for your project',
      '4. Create credentials (OAuth 2.0 Client ID)',
      '5. Add REACT_APP_GMAIL_USER=your_email@gmail.com to your .env.local file',
      '6. Add REACT_APP_GMAIL_KEY=your_oauth_token to your .env.local file',
      '7. Add REACT_APP_EMAIL_PROVIDER=gmail-api to your .env.local file'
    ],
    note: 'Gmail API requires OAuth 2.0 authentication. Uses browser-compatible fetch API.'
  },
  
  sendgrid: {
    steps: [
      '1. Sign up for a SendGrid account at https://sendgrid.com',
      '2. Create an API key in your SendGrid dashboard',
      '3. Add REACT_APP_SENDGRID_API_KEY=your_api_key to your .env.local file',
      '4. Add REACT_APP_EMAIL_PROVIDER=sendgrid-api to your .env.local file',
      '5. Add REACT_APP_FROM_EMAIL=your_verified_email@domain.com to your .env.local file'
    ],
    note: 'SendGrid requires email verification for the sender address. Uses browser-compatible fetch API.'
  },
  
  emailjs: {
    steps: [
      '1. Sign up for EmailJS at https://www.emailjs.com',
      '2. Create an email service (Gmail, Outlook, etc.)',
      '3. Create an email template with variables like {{to_email}}, {{subject}}, {{message}}',
      '4. Get your Service ID, Template ID, and Public Key from EmailJS dashboard',
      '5. Add REACT_APP_EMAILJS_SERVICE_ID=your_service_id to your .env.local file',
      '6. Add REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id to your .env.local file',
      '7. Add REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key to your .env.local file',
      '8. Add REACT_APP_EMAIL_PROVIDER=emailjs-api to your .env.local file'
    ],
    note: 'EmailJS API is browser-compatible and uses fetch API directly from the frontend'
  },
  
  simulated: {
    steps: [
      '1. No setup required - emails will be simulated',
      '2. Check the browser console to see simulated email logs',
      '3. To use real emails, configure one of the other providers'
    ],
    note: 'This is for development/testing only - no actual emails are sent'
  }
};

export default emailConfig;

// Email service for sending feedback request emails
// Browser-compatible email service using fetch API

class EmailService {
  constructor() {
    // Configure email provider - change this to your preferred service
    this.emailProvider = process.env.REACT_APP_EMAIL_PROVIDER || 'simulated'; // 'gmail-api', 'sendgrid-api', 'emailjs-api', 'simulated'
    this.initializeProvider();
  }

  initializeProvider() {
    switch (this.emailProvider) {
      case 'gmail-api':
        console.log('Using Gmail API via fetch - configure REACT_APP_GMAIL_USER and REACT_APP_GMAIL_KEY');
        break;
      case 'sendgrid-api':
        console.log('Using SendGrid API via fetch - configure REACT_APP_SENDGRID_API_KEY');
        break;
      case 'emailjs-api':
        console.log('Using EmailJS API via fetch - configure REACT_APP_EMAILJS_* variables');
        break;
      case 'simulated':
      default:
        console.log('Using simulated email service - no actual emails will be sent');
        break;
    }
  }

  // Send feedback request email to a colleague
  async sendFeedbackRequestEmail({
    toEmail,
    toName,
    fromName,
    fromEmail,
    quarterName,
    quarterYear,
    message,
    feedbackUrl
  }) {
    try {
      console.log('Sending feedback request email...', {
        to: toEmail,
        toName,
        from: fromName,
        quarter: `${quarterName} ${quarterYear}`
      });

      // Email template
      const emailTemplate = this.createFeedbackRequestTemplate({
        toName,
        fromName,
        quarterName,
        quarterYear,
        message,
        feedbackUrl
      });

      // Send the email using the configured provider
      const emailResult = await this.sendEmail({
        to: toEmail,
        subject: `Feedback Request for ${quarterName} ${quarterYear}`,
        html: emailTemplate.html,
        text: emailTemplate.text
      });

      return {
        success: true,
        messageId: emailResult.messageId,
        status: 'sent'
      };

    } catch (error) {
      console.error('Error sending feedback request email:', error);
      return {
        success: false,
        error: error.message,
        status: 'failed'
      };
    }
  }

  // Create email template for feedback request
  createFeedbackRequestTemplate({ toName, fromName, quarterName, quarterYear, message, feedbackUrl }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Feedback Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Feedback Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${toName},</h2>
            <p>${fromName} has requested your feedback for their performance review period: <strong>${quarterName} ${quarterYear}</strong>.</p>
            
            ${message ? `<div style="background-color: #e5e7eb; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3>Personal Message:</h3>
              <p><em>"${message}"</em></p>
            </div>` : ''}
            
            <p>Your feedback is valuable and will help ${fromName} understand their strengths and areas for improvement.</p>
            
            <div style="text-align: center;">
              <a href="${feedbackUrl || '#'}" class="button">Provide Feedback</a>
            </div>
            
            <p>If you have any questions or need clarification, please don't hesitate to reach out to ${fromName} directly.</p>
            
            <p>Thank you for your time and valuable input!</p>
          </div>
          <div class="footer">
            <p>This is an automated message from the Performance Management System.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Hi ${toName},

${fromName} has requested your feedback for their performance review period: ${quarterName} ${quarterYear}.

${message ? `Personal Message: "${message}"` : ''}

Your feedback is valuable and will help ${fromName} understand their strengths and areas for improvement.

To provide feedback, please visit: ${feedbackUrl || 'Contact the sender directly'}

If you have any questions or need clarification, please don't hesitate to reach out to ${fromName} directly.

Thank you for your time and valuable input!

---
This is an automated message from the Performance Management System.
Please do not reply to this email.
    `;

    return { html, text };
  }

  // Send email using the configured provider
  async sendEmail({ to, subject, html, text }) {
    try {
      switch (this.emailProvider) {
        case 'gmail-api':
          return await this.sendWithGmailAPI({ to, subject, html, text });
        
        case 'sendgrid-api':
          return await this.sendWithSendGridAPI({ to, subject, html, text });
        
        case 'emailjs-api':
          return await this.sendWithEmailJSAPI({ to, subject, html, text });
        
        case 'simulated':
        default:
          return await this.simulateEmailSending({ to, subject, html, text });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Send email using Gmail API via fetch (browser-compatible)
  async sendWithGmailAPI({ to, subject, html, text }) {
    const gmailUser = process.env.REACT_APP_GMAIL_USER;
    const gmailKey = process.env.REACT_APP_GMAIL_KEY;

    if (!gmailUser || !gmailKey) {
      throw new Error('Gmail credentials not configured. Please set REACT_APP_GMAIL_USER and REACT_APP_GMAIL_KEY');
    }

    // Create the email message in Gmail API format
    const emailMessage = {
      to: to,
      from: gmailUser,
      subject: subject,
      text: text,
      html: html
    };

    // Encode the message for Gmail API
    const encodedMessage = btoa(
      `To: ${to}\r\n` +
      `From: ${gmailUser}\r\n` +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/html; charset=utf-8\r\n` +
      `\r\n` +
      html
    ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${gmailKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gmail API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    const messageId = result.id || `gmail_${Date.now()}`;
    
    console.log('📧 Email sent via Gmail API:', {
      to,
      subject,
      messageId,
      timestamp: new Date().toISOString()
    });

    return {
      messageId,
      status: 'sent'
    };
  }

  // Send email using SendGrid API via fetch (browser-compatible)
  async sendWithSendGridAPI({ to, subject, html, text }) {
    const apiKey = process.env.REACT_APP_SENDGRID_API_KEY;
    const fromEmail = process.env.REACT_APP_FROM_EMAIL || 'noreply@yourcompany.com';

    if (!apiKey) {
      throw new Error('SendGrid API key not configured. Please set REACT_APP_SENDGRID_API_KEY');
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],
        from: { email: fromEmail },
        content: [
          {
            type: 'text/plain',
            value: text
          },
          {
            type: 'text/html',
            value: html
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid API error: ${response.status} - ${error}`);
    }

    const messageId = response.headers.get('x-message-id') || `sg_${Date.now()}`;
    
    console.log('📧 Email sent via SendGrid API:', {
      to,
      subject,
      messageId,
      timestamp: new Date().toISOString()
    });

    return {
      messageId,
      status: 'sent'
    };
  }

  // Send email using EmailJS API via fetch (browser-compatible)
  async sendWithEmailJSAPI({ to, subject, html, text }) {
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS configuration missing. Please set REACT_APP_EMAILJS_SERVICE_ID, REACT_APP_EMAILJS_TEMPLATE_ID, and REACT_APP_EMAILJS_PUBLIC_KEY');
    }

    const templateParams = {
      to_email: to,
      to_name: to.split('@')[0], // Extract name from email
      from_name: process.env.REACT_APP_FROM_NAME || 'Performance Management System',
      subject: subject,
      message: text,
      html_message: html
    };

    const response = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`EmailJS API error: ${response.status} - ${error}`);
    }

    const result = await response.text();
    
    console.log('📧 Email sent via EmailJS API:', {
      to,
      subject,
      messageId: result,
      timestamp: new Date().toISOString()
    });

    return {
      messageId: result,
      status: 'sent'
    };
  }

  // Simulate email sending (fallback when no real service is configured)
  async simulateEmailSending({ to, subject, html, text }) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('📧 Email simulated (not actually sent):', {
      to,
      subject,
      timestamp: new Date().toISOString(),
      note: 'Configure a real email service to send actual emails'
    });

    return {
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'simulated'
    };
  }

  // Send multiple feedback request emails
  async sendBulkFeedbackRequests(requests) {
    const results = [];
    
    for (const request of requests) {
      try {
        const result = await this.sendFeedbackRequestEmail(request);
        results.push({
          ...result,
          toEmail: request.toEmail,
          toName: request.toName
        });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          toEmail: request.toEmail,
          toName: request.toName,
          status: 'failed'
        });
      }
    }
    
    return results;
  }
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;

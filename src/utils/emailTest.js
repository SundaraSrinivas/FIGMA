// Simple utility to test email service configuration
import emailService from '../services/emailService';

export const testEmailService = () => {
  console.log('=== Email Service Test ===');
  console.log('Current provider:', emailService.emailProvider);
  
  if (emailService.emailProvider === 'simulated') {
    console.log('❌ Email service is in SIMULATED mode');
    console.log('📝 To enable real emails:');
    console.log('1. Create .env.local file in project root');
    console.log('2. Add: REACT_APP_EMAIL_PROVIDER=emailjs-api');
    console.log('3. Configure EmailJS credentials');
    console.log('4. Restart the development server');
    console.log('📖 See QUICK_EMAIL_SETUP.md for detailed instructions');
  } else {
    console.log('✅ Email service is configured for real sending');
    console.log('Provider:', emailService.emailProvider);
  }
  
  console.log('=== End Test ===');
};

// Auto-run test when imported
testEmailService();

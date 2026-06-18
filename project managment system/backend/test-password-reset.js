require('dotenv').config();
const emailService = require('./services/emailService');

const testPasswordReset = async () => {
  try {
    console.log('Testing password reset email...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);

    const testEmail = 'dasunaliexpress1@gmail.com';
    const testLink = 'http://localhost:3000/reset-password?token=test_token_12345';

    const result = await emailService.sendPasswordResetEmail(testEmail, testLink);

    if (result.success) {
      console.log('✅ Password reset email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send email');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('Test error:', error);
  }
};

testPasswordReset();

import nodemailer from 'nodemailer';

/**
 * Email service to handle all email communications
 */
class EmailService {
  constructor() {
    // Check if email settings are available
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      // Create reusable nodemailer transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      this.useConsoleLogger = false;
    } else {
      // Fall back to console logging in development mode
      console.log('Email settings not found - emails will be logged to console only');
      this.useConsoleLogger = process.env.NODE_ENV !== 'production';
      
      if (process.env.NODE_ENV === 'production') {
        console.error('WARNING: Production environment detected but email settings are missing!');
      }
    }
  }

  /**
   * Send a verification email to a user
   * @param {Object} options - Email options
   * @param {string} options.email - Recipient email
   * @param {string} options.name - Recipient name
   * @param {string} options.verificationToken - Verification token
   * @param {string} options.userType - Type of user (student, startup, club)
   * @returns {Promise<Object>} - Nodemailer info object
   */
  async sendVerificationEmail({ email, name, verificationToken, userType }) {
    // Extract the verification code from the token
    let verificationCode = '';
    try {
      const decodedToken = JSON.parse(Buffer.from(verificationToken.split('.')[1], 'base64').toString());
      verificationCode = decodedToken.code || '';
    } catch (err) {
      console.error('Failed to extract verification code from token:', err);
    }
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}&type=${userType}`;
    
    const displayName = name || email;
    
    // Email template based on user type
    let subject, greeting, customMessage;
    
    switch (userType) {
      case 'student':
        subject = 'Verify your student account on StartupsNet';
        greeting = `Hi ${displayName},`;
        customMessage = 'Thank you for creating a student account on StartupsNet. We\'re excited to help you connect with startups and opportunities!';
        break;
      case 'startup':
        subject = 'Verify your startup account on StartupsNet';
        greeting = `Hello from StartupsNet, ${displayName}!`;
        customMessage = 'Thank you for registering your startup with StartupsNet. We\'re excited to help you connect with student talent!';
        break;
      case 'club':
        subject = 'Verify your club account on StartupsNet';
        greeting = `Hello ${displayName},`;
        customMessage = 'Thank you for registering your club with StartupsNet. We\'re excited to help you connect with students and startups!';
        break;
      default:
        subject = 'Verify your account on StartupsNet';
        greeting = `Hello ${displayName},`;
        customMessage = 'Thank you for creating an account on StartupsNet.';
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4F46E5; margin: 0;">StartupsNet</h1>
        </div>
        
        <p style="margin-bottom: 15px;">${greeting}</p>
        
        <p style="margin-bottom: 15px;">${customMessage}</p>
        
        <p style="margin-bottom: 20px;">Please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify My Email</a>
        </div>
        
        ${verificationCode ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; text-align: center;">
          <p style="margin-bottom: 10px; font-size: 14px; color: #333;">Alternatively, you can use this verification code:</p>
          <div style="font-family: monospace; font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #4F46E5;">
            ${verificationCode}
          </div>
        </div>
        ` : ''}
        
        <p style="margin-bottom: 15px;">If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; word-break: break-all; font-size: 14px;">
          ${verificationUrl}
        </p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">If you did not create an account, please ignore this email.</p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #999;">
          <p>&copy; ${new Date().getFullYear()} StartupsNet. All rights reserved.</p>
        </div>
      </div>
    `;

    // If using console logger, output the email to console
    if (this.useConsoleLogger) {
      console.log('==== VERIFICATION EMAIL ====');
      console.log('To:', email);
      console.log('Subject:', subject);
      console.log('Verification URL:', verificationUrl);
      console.log('Verification Code:', verificationCode);
      console.log('========================');
      return Promise.resolve({ messageId: 'console-logged-' + Date.now() });
    }

    // Otherwise send via transporter
    return this.transporter.sendMail({
      from: `"StartupsNet" <${process.env.EMAIL_FROM || 'noreply@startupsnet.com'}>`,
      to: email,
      subject,
      html: htmlContent,
    });
  }

  /**
   * Send a confirmation email after successful verification
   * @param {Object} options - Email options
   * @param {string} options.email - Recipient email
   * @param {string} options.name - Recipient name
   * @param {string} options.userType - Type of user (student, startup, club)
   * @returns {Promise<Object>} - Nodemailer info object
   */
  async sendVerificationSuccessEmail({ email, name, userType }) {
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;
    
    const displayName = name || email;
    
    // Email template based on user type
    let subject, greeting, customMessage;
    
    switch (userType) {
      case 'student':
        subject = 'Your StartupsNet student account is verified!';
        greeting = `Hi ${displayName},`;
        customMessage = 'Your student account has been successfully verified. You can now access all student features on StartupsNet.';
        break;
      case 'startup':
        subject = 'Your StartupsNet startup account is verified!';
        greeting = `Hello from StartupsNet, ${displayName}!`;
        customMessage = 'Your startup account has been successfully verified. You can now access all startup features on StartupsNet.';
        break;
      case 'club':
        subject = 'Your StartupsNet club account is verified!';
        greeting = `Hello ${displayName},`;
        customMessage = 'Your club account has been successfully verified. You can now access all club features on StartupsNet.';
        break;
      default:
        subject = 'Your StartupsNet account is verified!';
        greeting = `Hello ${displayName},`;
        customMessage = 'Your account has been successfully verified. You can now access all features on StartupsNet.';
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4F46E5; margin: 0;">StartupsNet</h1>
        </div>
        
        <p style="margin-bottom: 15px;">${greeting}</p>
        
        <p style="margin-bottom: 15px;">${customMessage}</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #999;">
          <p>&copy; ${new Date().getFullYear()} StartupsNet. All rights reserved.</p>
        </div>
      </div>
    `;

    // If using console logger, output the email to console
    if (this.useConsoleLogger) {
      console.log('==== VERIFICATION SUCCESS EMAIL ====');
      console.log('To:', email);
      console.log('Subject:', subject);
      console.log('Login URL:', loginUrl);
      console.log('========================');
      return Promise.resolve({ messageId: 'console-logged-' + Date.now() });
    }

    return this.transporter.sendMail({
      from: `"StartupsNet" <${process.env.EMAIL_FROM || 'noreply@startupsnet.com'}>`,
      to: email,
      subject,
      html: htmlContent,
    });
  }
}

// Create a singleton instance
const emailService = new EmailService();

export default emailService; 
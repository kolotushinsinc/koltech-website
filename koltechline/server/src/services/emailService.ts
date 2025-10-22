import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

// Email templates
interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send messages');
    } catch (error) {
      console.error('❌ Email service verification failed:', error);
    }
  }

  // Welcome email template
  private getWelcomeTemplate(name: string): EmailTemplate {
    return {
      subject: 'Welcome to KolTech - Your Innovation Journey Starts Now! 🚀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to KolTech</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f172a; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
            .content { padding: 40px 30px; color: #e2e8f0; }
            .welcome-text { font-size: 24px; font-weight: bold; color: #f8fafc; margin-bottom: 20px; }
            .description { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px; }
            .features { background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 12px; padding: 25px; margin: 30px 0; }
            .feature-item { display: flex; align-items: center; margin-bottom: 15px; }
            .feature-icon { width: 20px; height: 20px; background: #6366f1; border-radius: 50%; margin-right: 15px; display: inline-block; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background: #020617; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚡ KolTech</div>
              <div class="subtitle">Building the Future of Technology</div>
            </div>
            
            <div class="content">
              <div class="welcome-text">Welcome, ${name}! 🎉</div>
              
              <div class="description">
                Thank you for joining KolTech! You're now part of an innovative community where technology meets creativity. 
                Our platform connects talented developers, designers, and innovators to create revolutionary digital solutions.
              </div>
              
              <div class="features">
                <h3 style="color: #f8fafc; margin-top: 0;">What you can do with KolTech:</h3>
                <div class="feature-item">
                  <span class="feature-icon"></span>
                  <span>Connect with top-tier freelancers and startups</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon"></span>
                  <span>Access cutting-edge web and mobile development</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon"></span>
                  <span>Explore AI solutions and machine learning</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon"></span>
                  <span>Launch your next big project with expert support</span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.CLIENT_URL}/profile" class="cta-button">
                  Complete Your Profile →
                </a>
              </div>
              
              <div class="description">
                Ready to start your innovation journey? Explore our platform and discover how we can bring your ideas to life!
              </div>
            </div>
            
            <div class="footer">
              <p>Best regards,<br><strong>The KolTech Team</strong></p>
              <p style="margin-top: 20px;">
                <a href="${process.env.CLIENT_URL}" style="color: #6366f1;">Visit KolTech</a> | 
                <a href="${process.env.CLIENT_URL}/portfolio" style="color: #6366f1;">View Portfolio</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to KolTech, ${name}!\n\nThank you for joining our innovative platform. You're now part of a community that's building the future of technology.\n\nWhat you can do:\n- Connect with top-tier freelancers\n- Access cutting-edge development services\n- Explore AI solutions\n- Launch your next big project\n\nGet started: ${process.env.CLIENT_URL}/profile\n\nBest regards,\nThe KolTech Team`
    };
  }

  // Password reset template
  private getPasswordResetTemplate(name: string, resetCode: string): EmailTemplate {
    return {
      subject: 'Reset Your KolTech Password 🔐',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f172a; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; color: #e2e8f0; }
            .title { font-size: 24px; font-weight: bold; color: #f8fafc; margin-bottom: 20px; }
            .description { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px; }
            .code-box { background: rgba(239, 68, 68, 0.1); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; }
            .code { font-size: 32px; font-weight: bold; color: #ef4444; letter-spacing: 4px; font-family: 'Courier New', monospace; margin: 10px 0; user-select: all; }
            .copy-instruction { color: #cbd5e1; font-size: 14px; margin-top: 15px; }
            .warning-box { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0; }
            .footer { background: #020617; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔐 KolTech</div>
            </div>
            
            <div class="content">
              <div class="title">Password Reset Code</div>
              
              <div class="description">
                Hi ${name},<br><br>
                We received a request to reset your KolTech account password. Use the code below to reset your password on our website.
              </div>
              
              <div class="code-box">
                <div style="color: #f8fafc; font-weight: bold; margin-bottom: 15px;">Your Reset Code:</div>
                <div class="code">${resetCode}</div>
                <div class="copy-instruction">Click to select and copy this code</div>
              </div>
              
              <div class="warning-box">
                <strong>⚠️ Security Notice:</strong><br>
                This code will expire in 10 minutes for security reasons. If you didn't request this password reset, please ignore this email.
              </div>
              
              <div class="description">
                Go to the KolTech password reset page and enter this code to create a new password.
              </div>
            </div>
            
            <div class="footer">
              <p>Best regards,<br><strong>The KolTech Security Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Password Reset Code\n\nHi ${name},\n\nWe received a request to reset your KolTech account password.\n\nYour reset code: ${resetCode}\n\nThis code will expire in 10 minutes. If you didn't request this, please ignore this email.\n\nBest regards,\nThe KolTech Security Team`
    };
  }

  // Email verification template
  private getEmailVerificationTemplate(name: string, verificationCode: string): EmailTemplate {
    return {
      subject: 'Verify Your KolTech Email Address ✉️',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f172a; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; color: #e2e8f0; }
            .title { font-size: 24px; font-weight: bold; color: #f8fafc; margin-bottom: 20px; }
            .description { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px; }
            .code-box { background: rgba(16, 185, 129, 0.1); border: 2px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; }
            .code { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 4px; font-family: 'Courier New', monospace; margin: 10px 0; user-select: all; }
            .copy-instruction { color: #cbd5e1; font-size: 14px; margin-top: 15px; }
            .footer { background: #020617; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✉️ KolTech</div>
            </div>
            
            <div class="content">
              <div class="title">Verify Your Email Address</div>
              
              <div class="description">
                Hi ${name},<br><br>
                Thank you for registering with KolTech! To complete your account setup and ensure security, please use the verification code below.
              </div>
              
              <div class="code-box">
                <div style="color: #f8fafc; font-weight: bold; margin-bottom: 15px;">Your Verification Code:</div>
                <div class="code">${verificationCode}</div>
                <div class="copy-instruction">Click to select and copy this code</div>
              </div>
              
              <div class="description">
                Enter this code on the KolTech email verification page to activate your account.
              </div>
            </div>
            
            <div class="footer">
              <p>Best regards,<br><strong>The KolTech Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Verify Your Email Address\n\nHi ${name},\n\nThank you for registering with KolTech! Your verification code: ${verificationCode}\n\nBest regards,\nThe KolTech Team`
    };
  }

  // Project notification template
  private getProjectNotificationTemplate(name: string, projectTitle: string, message: string): EmailTemplate {
    return {
      subject: `KolTech Project Update: ${projectTitle} 📋`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Update</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f172a; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; color: #e2e8f0; }
            .title { font-size: 24px; font-weight: bold; color: #f8fafc; margin-bottom: 20px; }
            .project-title { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 8px; padding: 15px; margin: 20px 0; color: #a78bfa; font-weight: bold; }
            .description { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px; }
            .view-button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background: #020617; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">📋 KolTech</div>
            </div>
            
            <div class="content">
              <div class="title">Project Update</div>
              
              <div class="description">
                Hi ${name},<br><br>
                You have a new update for your project:
              </div>
              
              <div class="project-title">
                ${projectTitle}
              </div>
              
              <div class="description">
                ${message}
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.CLIENT_URL}/profile" class="view-button">
                  View Project Details
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>Best regards,<br><strong>The KolTech Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Project Update: ${projectTitle}\n\nHi ${name},\n\n${message}\n\nView details: ${process.env.CLIENT_URL}/profile\n\nBest regards,\nThe KolTech Team`
    };
  }

  // Generic email sending method
  private async sendEmail(to: string, template: EmailTemplate, from?: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: from || `"KolTech Team" <${process.env.SMTP_USER}>`,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  // Public methods for different email types
  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const template = this.getWelcomeTemplate(name);
    return this.sendEmail(to, template);
  }

  async sendPasswordResetEmail(to: string, name: string, resetCode: string): Promise<boolean> {
    const template = this.getPasswordResetTemplate(name, resetCode);
    return this.sendEmail(to, template);
  }

  async sendEmailVerification(to: string, name: string, verificationCode: string): Promise<boolean> {
    const template = this.getEmailVerificationTemplate(name, verificationCode);
    return this.sendEmail(to, template);
  }

  async sendProjectNotification(to: string, name: string, projectTitle: string, message: string): Promise<boolean> {
    const template = this.getProjectNotificationTemplate(name, projectTitle, message);
    return this.sendEmail(to, template);
  }

  // Send custom email
  async sendCustomEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    const template: EmailTemplate = {
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };
    return this.sendEmail(to, template);
  }
}

export const emailService = new EmailService();
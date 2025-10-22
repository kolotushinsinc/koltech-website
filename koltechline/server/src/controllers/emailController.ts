import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { emailService } from '../services/emailService.js';
import User from '../models/User.js';

// @desc    Send contact form email
// @route   POST /api/email/contact
// @access  Public
export const sendContactEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    if (!name || !email || !subject || !message) {
      return next(new AppError('Name, email, subject and message are required', 400));
    }

    // Create HTML template for contact email
    const contactHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; }
          .logo { color: white; font-size: 24px; font-weight: bold; }
          .content { padding: 30px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #374151; margin-bottom: 5px; }
          .value { color: #6b7280; line-height: 1.6; }
          .message-box { background: #f3f4f6; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ KolTech - New Contact</div>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Contact Form Submission</h2>
            
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            
            ${phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${phone}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent from the KolTech contact form</p>
            <p>Received at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    const success = await emailService.sendCustomEmail(
      process.env.SMTP_USER!, // Send to our email
      `KolTech Contact: ${subject}`,
      contactHTML
    );

    if (!success) {
      return next(new AppError('Failed to send contact email', 500));
    }

    // Send auto-reply to user
    const autoReplyHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for contacting KolTech</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f172a; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .content { padding: 40px 30px; color: #e2e8f0; }
          .title { font-size: 24px; font-weight: bold; color: #f8fafc; margin-bottom: 20px; }
          .description { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px; }
          .info-box { background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { background: #020617; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ KolTech</div>
            <div style="color: rgba(255,255,255,0.9); font-size: 16px;">Thank you for contacting us!</div>
          </div>
          
          <div class="content">
            <div class="title">Hi ${name}! 👋</div>
            
            <div class="description">
              Thank you for reaching out to KolTech! We've received your message and our team will get back to you within 24 hours.
            </div>
            
            <div class="info-box">
              <h3 style="color: #f8fafc; margin-top: 0;">Your message summary:</h3>
              <p style="color: #cbd5e1; margin: 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div class="description">
              In the meantime, feel free to explore our platform and discover how we can help bring your innovative ideas to life!
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
    `;

    await emailService.sendCustomEmail(
      email,
      'Thank you for contacting KolTech! 🚀',
      autoReplyHTML
    );

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Message sent successfully' },
      message: 'Your message has been sent successfully. We will get back to you soon!'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

// @desc    Send newsletter subscription confirmation
// @route   POST /api/email/newsletter
// @access  Public
export const subscribeNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    // Create newsletter subscription email
    const newsletterHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to KolTech Newsletter</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f172a; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .content { padding: 40px 30px; color: #e2e8f0; }
          .title { font-size: 24px; font-weight: bold; color: #f8fafc; margin-bottom: 20px; }
          .description { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px; }
          .benefits { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { background: #020617; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">📧 KolTech Newsletter</div>
            <div style="color: rgba(255,255,255,0.9); font-size: 16px;">Welcome to our community!</div>
          </div>
          
          <div class="content">
            <div class="title">Thank you for subscribing! 🎉</div>
            
            <div class="description">
              ${name ? `Hi ${name}!` : 'Hello!'}<br><br>
              Welcome to the KolTech newsletter! You're now part of our innovative community and will be the first to know about:
            </div>
            
            <div class="benefits">
              <h3 style="color: #f8fafc; margin-top: 0;">What you'll receive:</h3>
              <ul style="color: #cbd5e1; margin: 0; padding-left: 20px;">
                <li>Latest technology trends and insights</li>
                <li>New project showcases and case studies</li>
                <li>Industry tips from our expert team</li>
                <li>Exclusive offers and early access to new features</li>
                <li>Upcoming events and webinars</li>
              </ul>
            </div>
            
            <div class="description">
              Get ready for cutting-edge content that will help you stay ahead in the tech world!
            </div>
          </div>
          
          <div class="footer">
            <p>Best regards,<br><strong>The KolTech Team</strong></p>
            <p style="margin-top: 20px;">
              <a href="${process.env.CLIENT_URL}" style="color: #10b981;">Visit KolTech</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const success = await emailService.sendCustomEmail(
      email,
      'Welcome to KolTech Newsletter! 🚀',
      newsletterHTML
    );

    if (!success) {
      return next(new AppError('Failed to send newsletter confirmation', 500));
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Newsletter subscription confirmed' },
      message: 'Thank you for subscribing to our newsletter!'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

// @desc    Send project notification to user
// @route   POST /api/email/project-notification
// @access  Private
export const sendProjectNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, projectTitle, message } = req.body;

    if (!userId || !projectTitle || !message) {
      return next(new AppError('User ID, project title and message are required', 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (!user.email) {
      return next(new AppError('User does not have an email address', 400));
    }

    const success = await emailService.sendProjectNotification(
      user.email,
      `${user.firstName} ${user.lastName}`,
      projectTitle,
      message
    );

    if (!success) {
      return next(new AppError('Failed to send project notification', 500));
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Project notification sent successfully' },
      message: 'Notification sent to user'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

// @desc    Test email functionality
// @route   POST /api/email/test
// @access  Private (Admin only)
export const testEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, type = 'welcome' } = req.body;

    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    let success = false;

    switch (type) {
      case 'welcome':
        success = await emailService.sendWelcomeEmail(email, 'Test User');
        break;
      case 'verification':
        success = await emailService.sendEmailVerification(email, 'Test User', '123456');
        break;
      case 'reset':
        success = await emailService.sendPasswordResetEmail(email, 'Test User', '123456');
        break;
      case 'project':
        success = await emailService.sendProjectNotification(email, 'Test User', 'Test Project', 'This is a test notification message.');
        break;
      default:
        return next(new AppError('Invalid email type', 400));
    }

    if (!success) {
      return next(new AppError('Failed to send test email', 500));
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: `Test ${type} email sent successfully` },
      message: 'Test email sent'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};
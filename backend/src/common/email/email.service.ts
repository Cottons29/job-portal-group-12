import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"FirstStep" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      return false;
    }
  }

  async sendOtpEmail(email: string, otp: string) {
    const subject = 'FirstStep - Verify your email';
    const html = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px;">
        <h2 style="color: #2563eb; font-weight: 800;">FirstStep Email Verification</h2>
        <p>Thank you for registering. Use the OTP code below to verify your email address:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1f2937; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 12px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `;
    return this.sendMail(email, subject, html);
  }

  async sendResetOtpEmail(email: string, otp: string) {
    const subject = 'FirstStep - Password Reset OTP';
    const html = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px;">
        <h2 style="color: #dc2626; font-weight: 800;">Reset Your Password</h2>
        <p>We received a request to reset your password. Use the OTP code below to proceed:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1f2937; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 12px;">This code will expire in 10 minutes. If you did not make this request, please change your password immediately.</p>
      </div>
    `;
    return this.sendMail(email, subject, html);
  }

  async sendApplicationSubmittedEmail(employerEmail: string, employerName: string, studentName: string, postTitle: string) {
    const subject = `New Application Received: ${postTitle}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px;">
        <h2 style="color: #2563eb; font-weight: 800;">New Application Received</h2>
        <p>Dear ${employerName},</p>
        <p>A new application has been submitted for your job post: <strong>"${postTitle}"</strong>.</p>
        <div style="background-color: #f9fafb; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0;"><strong>Applicant Name:</strong> ${studentName}</p>
        </div>
        <p>Please log in to your FirstStep account to review their application, cover letter, and resume.</p>
        <a href="${process.env.WEBAUTHN_ORIGIN || 'http://localhost:5173'}/home" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Review Applications</a>
      </div>
    `;
    return this.sendMail(employerEmail, subject, html);
  }

  async sendApplicationStatusUpdatedEmail(studentEmail: string, studentName: string, postTitle: string, status: string, companyName: string) {
    const subject = `Application Update: ${postTitle}`;
    
    let statusText = '';
    let color = '#2563eb';
    let extraText = '';

    if (status === 'ACCEPTED') {
      statusText = 'Accepted / Job Offer!';
      color = '#10b981';
      extraText = '🎉 Congratulations! The employer has accepted your application and extended an offer. Keep an eye on your messages or mailbox for next steps!';
    } else if (status === 'REJECTED') {
      statusText = 'Rejected';
      color = '#ef4444';
      extraText = 'Thank you for your interest and the time you spent applying. The employer has decided to pursue other applicants for this position. Do not be discouraged; new opportunities are posted daily!';
    } else if (status === 'REVIEWED') {
      statusText = 'Under Review';
      color = '#3b82f6';
      extraText = 'Your application has been reviewed and is currently under active consideration by the hiring team.';
    } else {
      statusText = 'Pending';
      color = '#6b7280';
      extraText = 'Your application has been received and is waiting to be reviewed.';
    }

    const html = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px;">
        <h2 style="color: ${color}; font-weight: 800;">Application Update</h2>
        <p>Dear ${studentName},</p>
        <p>We wanted to let you know that your application status for <strong>"${postTitle}"</strong> at <strong>${companyName}</strong> has been updated:</p>
        <div style="background-color: #f9fafb; border-left: 4px solid ${color}; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 16px;"><strong>New Status:</strong> <span style="color: ${color}; font-weight: bold;">${statusText}</span></p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #4b5563; line-height: 1.5;">${extraText}</p>
        </div>
        <a href="${process.env.WEBAUTHN_ORIGIN || 'http://localhost:5173'}/home" style="display: inline-block; background-color: ${color}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Go to Dashboard</a>
      </div>
    `;
    return this.sendMail(studentEmail, subject, html);
  }

  async sendVerificationApprovedEmail(userEmail: string, userName: string, role: string) {
    const subject = 'FirstStep - Identity Verification Approved';
    const html = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px;">
        <h2 style="color: #10b981; font-weight: 800;">Verification Approved!</h2>
        <p>Dear ${userName},</p>
        <p>We are excited to inform you that your identity verification documents have been reviewed and approved by our moderation team.</p>
        <p>A verification trust badge has been added to your profile. You now have full verified access to posting jobs, applying, and messaging on FirstStep!</p>
        <a href="${process.env.WEBAUTHN_ORIGIN || 'http://localhost:5173'}/home" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Go to Portal</a>
      </div>
    `;
    return this.sendMail(userEmail, subject, html);
  }

  async sendVerificationRejectedEmail(userEmail: string, userName: string, role: string) {
    const subject = 'FirstStep - Verification Update';
    const html = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px;">
        <h2 style="color: #ef4444; font-weight: 800;">Verification Document Rejected</h2>
        <p>Dear ${userName},</p>
        <p>Your identity verification documents were reviewed and did not meet our verification criteria.</p>
        <p>Please log in to your settings page to re-upload a clear and valid copy of your ${role === 'STUDENT' ? 'Student ID card' : 'Business Patent / SME document'}.</p>
        <a href="${process.env.WEBAUTHN_ORIGIN || 'http://localhost:5173'}/settings" style="display: inline-block; background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Upload Document</a>
      </div>
    `;
    return this.sendMail(userEmail, subject, html);
  }
}

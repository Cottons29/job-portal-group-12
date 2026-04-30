import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

export interface User {
  id: number;
  phone: string;
  email: string | null;
  password: string;
  role: string;
  profileCompleted: boolean;
}

export interface OtpRecord {
  email: string;
  code: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private users: User[] = [];
  private otps: OtpRecord[] = [];
  private idCounter = 1;

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, 
    },
  });

  constructor() {}

  async register(phone: string, password: string, role: string): Promise<Omit<User, 'password'>> {
    const existing = this.users.find((u) => u.phone === phone);
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      id: this.idCounter++,
      phone,
      email: null,
      password: hashedPassword,
      role: role || 'student',
      profileCompleted: false
    };
    this.users.push(user);

    const { password: _, ...result } = user;
    return result;
  }

  async validateUser(phone: string, password: string): Promise<Omit<User, 'password'>> {
    const user = this.users.find((u) => u.phone === phone);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async sendOtp(email: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    const expiresAt = Date.now() + 10 * 60 * 1000; // valid for 10 min
    
    // Check if email already in use by another user
    if (this.users.find(u => u.email === email)) {
      throw new ConflictException("Email is already used by another account.");
    }

    this.otps = this.otps.filter(o => o.email !== email); 
    this.otps.push({ email, code, expiresAt });

    try {
      if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        await this.transporter.sendMail({
          from: `"FirstStep Security" <${process.env.GMAIL_USER}>`,
          to: email, // Sending directly to whatever email they type into the SecureAccount.vue view!
          subject: 'FirstStep Security Authentication Code',
          html: `<div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 12px;">
                   <h2 style="color: #0f172a; margin-bottom: 20px;">Your Security Code</h2>
                   <p style="color: #475569; font-size: 16px;">Please use the following 6-digit code to securely attach this email address to your FirstStep profile.</p>
                   <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; display: inline-block; border: 1px solid #e2e8f0;">
                     <strong style="color: #004ac6; font-size: 32px; letter-spacing: 6px;">${code}</strong>
                   </div>
                   <p style="color: #64748b; font-size: 14px;">This code will automatically expire in 10 minutes.</p>
                 </div>`,
        });
        console.log(`\n\n══════════════════════════════════════`);
        console.log(`[SMTP SUCCESS] NODEMAILER OTP SENT!`);
        console.log(`Destination: ${email}`);
        console.log(`══════════════════════════════════════\n\n`);
      } else {
        console.log(`[DEV MODE] NODEMAILER CREDENTIALS MISSING. Check .env!`);
      }
    } catch (error) {
      console.error('Nodemailer Error:', error);
      throw new BadRequestException('Could not dispatch email via Gmail SMTP.');
    }
  }

  async verifyOtpAndAttachEmail(userId: number, email: string, code: string): Promise<Omit<User, 'password'>> {
    const record = this.otps.find(o => o.email === email && o.code === code);
    
    if (!record) {
      throw new BadRequestException('Invalid verification code');
    }
    if (Date.now() > record.expiresAt) {
      throw new BadRequestException('Verification code has expired');
    }

    const user = this.users.find(u => u.id === userId);
    if (!user) {
        throw new UnauthorizedException('User not found');
    }
    
    user.email = email;
    this.otps = this.otps.filter(o => o.email !== email); // consume OTP
    
    const { password: _, ...result } = user;
    return result;
  }
}

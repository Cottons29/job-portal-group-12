import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../common/enums/user-role.enum';
import { AccountStatus } from '../common/enums/account-status.enum';
import { User } from '../modules/user/user.entity';

export interface OtpRecord {
  email: string;
  code: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private otps: OtpRecord[] = [];

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(phone: string, password: string, role: string) {
    const existing = await this.userRepository.findOne({ where: { phone } });
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      phone,
      password: hashedPassword,
      role: role === 'employer' ? UserRole.EMPLOYER : UserRole.STUDENT,
      status: AccountStatus.ACTIVE,
    });

    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { user: result, token };
  }

  async validateUser(phone: string, password: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { user: result, token };
  }

  async sendOtp(email: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email is already used by another account.');
    }

    this.otps = this.otps.filter((o) => o.email !== email);
    this.otps.push({ email, code, expiresAt });

    console.log(`ENV : ${process.env}`);

    try {
      if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        await this.transporter.sendMail({
          from: `"FirstStep Security" <${process.env.GMAIL_USER}>`,
          to: email,
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
      }
    } catch (error) {
      throw new BadRequestException('Could not dispatch email via Gmail SMTP.');
    }
  }

  async verifyOtpAndAttachEmail(userId: string, email: string, code: string) {
    const record = this.otps.find((o) => o.email === email && o.code === code);

    if (!record) {
      throw new BadRequestException('Invalid verification code');
    }
    if (Date.now() > record.expiresAt) {
      throw new BadRequestException('Verification code has expired');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.email = email;
    await this.userRepository.save(user);

    this.otps = this.otps.filter((o) => o.email !== email);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }
}

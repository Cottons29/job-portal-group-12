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
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { UserRole } from '../common/enums/user-role.enum';
import { AccountStatus } from '../common/enums/account-status.enum';
import { User } from '../modules/user/user.entity';
import { PasskeyCredential } from './passkey-credential.entity';

export interface OtpRecord {
  email: string;
  code: string;
  expiresAt: number;
}

interface ChallengeRecord {
  challenge: string;
  userId?: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private otps: OtpRecord[] = [];
  private registrationChallenges = new Map<string, ChallengeRecord>();
  private authenticationChallenges = new Map<string, ChallengeRecord>();

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
    @InjectRepository(PasskeyCredential)
    private passkeyRepository: Repository<PasskeyCredential>,
    private jwtService: JwtService,
  ) {}

  private get rpName() {
    return process.env.WEBAUTHN_RP_NAME || 'FirstStep';
  }

  private get rpId() {
    return process.env.WEBAUTHN_RP_ID || 'localhost';
  }

  private get origin() {
    return process.env.WEBAUTHN_ORIGIN || 'http://localhost:5173';
  }

  private createToken(user: User) {
    return this.jwtService.sign({ sub: user.id, role: user.role });
  }

  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  private bufferToBase64(buffer: Uint8Array) {
    return Buffer.from(buffer).toString('base64');
  }

  private base64ToBuffer(value: string) {
    return new Uint8Array(Buffer.from(value, 'base64'));
  }

  private pruneChallenges() {
    const now = Date.now();

    for (const [key, record] of this.registrationChallenges) {
      if (record.expiresAt < now) {
        this.registrationChallenges.delete(key);
      }
    }

    for (const [key, record] of this.authenticationChallenges) {
      if (record.expiresAt < now) {
        this.authenticationChallenges.delete(key);
      }
    }
  }

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

    const token = this.createToken(user);
    return { user: this.sanitizeUser(user), token };
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

    const token = this.createToken(user);
    return { user: this.sanitizeUser(user), token };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('Current password and new password are required');
    }

    if (newPassword.length < 8) {
      throw new BadRequestException('New password must be at least 8 characters');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }

  async listPasskeys(userId: string) {
    return this.passkeyRepository.find({
      where: { userId },
      select: ['id', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async startPasskeyRegistration(userId: string) {
    this.pruneChallenges();

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const existingCredentials = await this.passkeyRepository.find({ where: { userId } });
    const options = await generateRegistrationOptions({
      rpName: this.rpName,
      rpID: this.rpId,
      userID: Buffer.from(user.id),
      userName: user.email || user.phone,
      userDisplayName: user.email || user.phone,
      attestationType: 'none',
      excludeCredentials: existingCredentials.map((credential) => ({
        id: credential.credentialId,
        transports: credential.transports as AuthenticatorTransportFuture[],
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    this.registrationChallenges.set(options.challenge, {
      challenge: options.challenge,
      userId,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return options;
  }

  async finishPasskeyRegistration(userId: string, response: RegistrationResponseJSON) {
    this.pruneChallenges();

    const challengeRecord = [...this.registrationChallenges.values()].find(
      (record) => record.userId === userId,
    );
    if (!challengeRecord) {
      throw new BadRequestException('Passkey registration challenge expired');
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challengeRecord.challenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpId,
      requireUserVerification: false,
    });

    this.registrationChallenges.delete(challengeRecord.challenge);

    if (!verification.verified) {
      throw new BadRequestException('Passkey registration failed');
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
    const existing = await this.passkeyRepository.findOne({
      where: { credentialId: credential.id },
    });
    if (existing) {
      throw new ConflictException('This passkey is already registered');
    }

    await this.passkeyRepository.save(
      this.passkeyRepository.create({
        userId,
        credentialId: credential.id,
        publicKey: this.bufferToBase64(credential.publicKey),
        counter: credential.counter,
        transports: response.response.transports || [],
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
      }),
    );

    return this.listPasskeys(userId);
  }

  async startPasskeyAuthentication() {
    this.pruneChallenges();

    const credentials = await this.passkeyRepository.find();
    const options = await generateAuthenticationOptions({
      rpID: this.rpId,
      allowCredentials: credentials.map((credential) => ({
        id: credential.credentialId,
        transports: credential.transports as AuthenticatorTransportFuture[],
      })),
      userVerification: 'preferred',
    });

    this.authenticationChallenges.set(options.challenge, {
      challenge: options.challenge,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return options;
  }

  async finishPasskeyAuthentication(response: AuthenticationResponseJSON) {
    this.pruneChallenges();

    const challengeRecord = this.authenticationChallenges.get(response.response.clientDataJSON)
      || [...this.authenticationChallenges.values()][0];
    if (!challengeRecord) {
      throw new BadRequestException('Passkey login challenge expired');
    }

    const passkey = await this.passkeyRepository.findOne({
      where: { credentialId: response.id },
      relations: ['user'],
    });
    if (!passkey) {
      throw new UnauthorizedException('Passkey is not registered');
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challengeRecord.challenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpId,
      requireUserVerification: false,
      credential: {
        id: passkey.credentialId,
        publicKey: this.base64ToBuffer(passkey.publicKey),
        counter: passkey.counter,
        transports: passkey.transports as AuthenticatorTransportFuture[],
      },
    });

    this.authenticationChallenges.delete(challengeRecord.challenge);

    if (!verification.verified) {
      throw new UnauthorizedException('Passkey login failed');
    }

    passkey.counter = verification.authenticationInfo.newCounter;
    passkey.deviceType = verification.authenticationInfo.credentialDeviceType;
    passkey.backedUp = verification.authenticationInfo.credentialBackedUp;
    await this.passkeyRepository.save(passkey);

    return { user: this.sanitizeUser(passkey.user), token: this.createToken(passkey.user) };
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

    return this.sanitizeUser(user);
  }
}

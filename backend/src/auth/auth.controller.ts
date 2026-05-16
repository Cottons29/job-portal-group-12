import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './authenticated.guard';
import { PayloadEncryptionService } from './payload-encryption.service';
import type { EncryptedPayloadDto } from './encrypted-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly payloadEncryptionService: PayloadEncryptionService,
  ) {}

  private getAuthenticatedUserId(req: Request) {
    return (
      (req as Request & { user?: { sub?: string } }).user?.sub ||
      req.session.userId
    );
  }

  @Get('encryption-key')
  getEncryptionKey() {
    return { publicKey: this.payloadEncryptionService.getPublicKey() };
  }

  @Post('register')
  async register(
    @Body() encryptedBody: EncryptedPayloadDto,
    @Req() req: Request,
  ) {
    const body = await this.payloadEncryptionService.decrypt<{
      phone: string;
      password: string;
      role: string;
    }>(encryptedBody);
    const { user, token } = await this.authService.register(
      body.phone,
      body.password,
      body.role,
    );
    req.session.userId = user.id;
    return { message: 'Registration successful', user, token };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() encryptedBody: EncryptedPayloadDto, @Req() req: Request) {
    const body = await this.payloadEncryptionService.decrypt<{
      phone: string;
      password: string;
    }>(encryptedBody);
    const { user, token } = await this.authService.validateUser(
      body.phone,
      body.password,
    );
    req.session.userId = user.id;
    return { message: 'Login successful', user, token };
  }

  @Post('passkey/login/options')
  @HttpCode(HttpStatus.OK)
  async startPasskeyLogin() {
    return this.authService.startPasskeyAuthentication();
  }

  @Post('passkey/login/verify')
  @HttpCode(HttpStatus.OK)
  async finishPasskeyLogin(
    @Body() body: { response: AuthenticationResponseJSON },
    @Req() req: Request,
  ) {
    const { user, token } = await this.authService.finishPasskeyAuthentication(
      body.response,
    );
    req.session.userId = user.id;
    return { message: 'Passkey login successful', user, token };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('passkeys')
  async listPasskeys(@Req() req: Request) {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return { passkeys: await this.authService.listPasskeys(userId) };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('passkey/register/options')
  @HttpCode(HttpStatus.OK)
  async startPasskeyRegistration(@Req() req: Request) {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return this.authService.startPasskeyRegistration(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('passkey/register/verify')
  @HttpCode(HttpStatus.OK)
  async finishPasskeyRegistration(
    @Body() body: { response: RegistrationResponseJSON },
    @Req() req: Request,
  ) {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return {
      passkeys: await this.authService.finishPasskeyRegistration(
        userId,
        body.response,
      ),
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() encryptedBody: EncryptedPayloadDto,
    @Req() req: Request,
  ) {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const body = await this.payloadEncryptionService.decrypt<{
      currentPassword: string;
      newPassword: string;
    }>(encryptedBody);
    await this.authService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
    );
    return { message: 'Password updated successfully' };
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() encryptedBody: EncryptedPayloadDto) {
    const body = await this.payloadEncryptionService.decrypt<{ email: string }>(
      encryptedBody,
    );
    await this.authService.sendOtp(body.email);
    return { message: 'Verification code sent to email.' };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedGuard)
  async verifyOtp(
    @Body() encryptedBody: EncryptedPayloadDto,
    @Req() req: Request,
  ) {
    const body = await this.payloadEncryptionService.decrypt<{
      email: string;
      code: string;
      userId?: string;
    }>(encryptedBody);
    // Extract userId from the decoded JWT payload added by AuthenticatedGuard
    const userId = this.getAuthenticatedUserId(req) || body.userId;
    if (!userId) {
      throw new UnauthorizedException(
        'User is not properly authenticated to link email',
      );
    }

    const user = await this.authService.verifyOtpAndAttachEmail(
      userId,
      body.email,
      body.code,
    );
    return { message: 'Email forcefully secured', user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    req.session.destroy(() => undefined);
    return { message: 'Logout successful' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await this.authService.getCurrentUser(userId);
    return { user };
  }
}

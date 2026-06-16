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
  BadRequestException,
} from '@nestjs/common';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './authenticated.guard';
import { PayloadEncryptionService } from './payload-encryption.service';
import type { EncryptedPayloadDto } from './encrypted-payload.dto';
import { RegisterDto } from './dto/register.dto';

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
    
    const rawBody = await this.payloadEncryptionService.decrypt<{
      phone: string;
      password: string;
      role: string;
    }>(encryptedBody);

    rawBody.role = rawBody.role.toUpperCase();

    const dto = plainToInstance(RegisterDto, rawBody);

    const errors = await validate(dto);

   if (errors.length > 0) {
  const formattedErrors: Record<string, string> = {};

  errors.forEach(error => {
    if (error.constraints) {
      formattedErrors[error.property] =
        Object.values(error.constraints)[0];
    }
  });

  throw new BadRequestException({
    errors: formattedErrors,
  });
}
    const { user, token } = await this.authService.register(
      dto.phone,
      dto.password,
      dto.role,
    );
    req.session.userId = user.id;
    (req.session as any).userRole = user.role;
    return { message: 'Registration successful', user, token };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() encryptedBody: EncryptedPayloadDto, @Req() req: Request) {
    const body = await this.payloadEncryptionService.decrypt<{
      phone: string;
      password: string;
      role?: string;
    }>(encryptedBody);
    const { user, token } = await this.authService.validateUser(
      body.phone,
      body.password,
      body.role,
    );
    req.session.userId = user.id;
    (req.session as any).userRole = user.role;
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
    (req.session as any).userRole = user.role;
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
  @Post('forgot-password')
  async forgotPassword(@Body() encryptedBody: EncryptedPayloadDto,@Req() req:Request){
    const body =await this.payloadEncryptionService.decrypt<{
     email:string
    }>(encryptedBody)
    await this.authService.sendForgotPasswordOtp(body.email)
    console.log("this is body after decryted", body)
     return { message: 'Verification code for forgot password sent to email.' };

  }
  @Post('verify-reset-otp')
async verifyResetOtp(
  @Body() encryptedBody:
    EncryptedPayloadDto,
) {

  const body =
    await this.payloadEncryptionService
      .decrypt<{
        email: string
        code: string
      }>(encryptedBody)

  await this.authService.verifyResetOtp(
    body.email,
    body.code,
  )

  return {
    message:
      'OTP verified successfully'
  }
}
  @Post('reset-password')
  async resetPassword(
    @Body() encryptedBody:
      EncryptedPayloadDto,
  ) {

    const body =
      await this.payloadEncryptionService
        .decrypt<{
          email: string
          code: string
          newPassword: string
        }>(encryptedBody);

    await this.authService
      .resetPassword(
        body.email,
        body.code,
        body.newPassword,
      );

    return {
      message:
        'Password reset successful'
    };
  }

  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  async googleLogin(
    @Body() body: { token: string; role?: string },
    @Req() req: Request,
  ) {
    const { user, token } = await this.authService.googleLogin(
      body.token,
      body.role,
    );
    req.session.userId = user.id;
    (req.session as any).userRole = user.role;
    return { message: 'Google login successful', user, token };
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

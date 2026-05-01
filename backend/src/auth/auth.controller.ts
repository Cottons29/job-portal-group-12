import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { phone: string; password: string; role: string },
  ) {
    const { user, token } = await this.authService.register(
      body.phone,
      body.password,
      body.role,
    );
    return { message: 'Registration successful', user, token };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { phone: string; password: string },
  ) {
    const { user, token } = await this.authService.validateUser(body.phone, body.password);
    return { message: 'Login successful', user, token };
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() body: { email: string }) {
    await this.authService.sendOtp(body.email);
    return { message: 'Verification code sent to email.' };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedGuard)
  async verifyOtp(
    @Body() body: { email: string; code: string; userId?: string },
    @Req() req: any,
  ) {
    // Extract userId from the decoded JWT payload added by AuthenticatedGuard
    const userId = req.user?.sub || body.userId;
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
  logout() {
    return { message: 'Logout successful' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    return { userId: req.user?.sub };
  }
}

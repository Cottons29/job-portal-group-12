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
  UnauthorizedException
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
    @Req() req: Request,
  ) {
    const user = await this.authService.register(body.phone, body.password, body.role);
    (req.session as any).userId = user.id;
    const token = `token-${user.id}-${Date.now()}`;
    return { message: 'Registration successful', user, token };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { phone: string; password: string },
    @Req() req: Request,
  ) {
    const user = await this.authService.validateUser(body.phone, body.password);
    (req.session as any).userId = user.id;
    const token = `token-${user.id}-${Date.now()}`;
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
  async verifyOtp(
    @Body() body: { email: string; code: string; userId?: number },
    @Req() req: Request,
  ) {
    // Attempt to extract userId from session (if cookies are passed), or fallback to body payload (for naive JWT implementation)
    const userId = (req.session as any).userId || body.userId;
    if (!userId) {
      throw new UnauthorizedException('User is not properly authenticated to link email');
    }

    const user = await this.authService.verifyOtpAndAttachEmail(userId, body.email, body.code);
    return { message: 'Email forcefully secured', user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: 'Logout successful' });
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return { userId: (req.session as any).userId };
  }
}

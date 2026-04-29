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
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
  ) {
    const user = await this.authService.register(body.email, body.password);
    (req.session as any).userId = user.id;
    return { message: 'Registration successful', user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    (req.session as any).userId = user.id;
    return { message: 'Login successful', user };
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

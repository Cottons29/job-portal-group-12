import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  async getMe(@Req() req: any) {
    return this.userService.findById(req.user.sub);
  }
}

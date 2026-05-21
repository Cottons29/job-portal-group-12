import { Controller, Post, Get, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { FollowsService } from './follows.service';

@Controller('follows')
@UseGuards(AuthenticatedGuard)
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post('toggle/:targetUserId')
  @HttpCode(HttpStatus.OK)
  async toggleFollow(@Req() req: any, @Param('targetUserId') targetUserId: string) {
    return this.followsService.toggleFollow(req.user.sub, targetUserId);
  }

  @Get('status/:targetUserId')
  async getStatus(@Req() req: any, @Param('targetUserId') targetUserId: string) {
    const followed = await this.followsService.isFollowing(req.user.sub, targetUserId);
    return { followed };
  }

  @Get('followers')
  async getMyFollowers(@Req() req: any) {
    const followers = await this.followsService.getFollowers(req.user.sub);
    return { followers };
  }

  @Get('following')
  async getMyFollowing(@Req() req: any) {
    const following = await this.followsService.getFollowing(req.user.sub);
    return { following };
  }

  @Get('suggestions')
  async getSuggestions(@Req() req: any) {
    const suggestions = await this.followsService.getSuggestions(req.user.sub);
    return { suggestions };
  }

  @Get(':userId/followers')
  async getUserFollowers(@Param('userId') userId: string) {
    const followers = await this.followsService.getFollowers(userId);
    return { followers };
  }

  @Get(':userId/following')
  async getUserFollowing(@Param('userId') userId: string) {
    const following = await this.followsService.getFollowing(userId);
    return { following };
  }
}

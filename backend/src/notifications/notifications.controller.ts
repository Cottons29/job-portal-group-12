import {
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(AuthenticatedGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Req() req: any) {
    const notifications = await this.notificationsService.getNotificationsForUser(
      req.user.sub,
    );
    return { notifications };
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    try {
      const notification = await this.notificationsService.markAsRead(
        id,
        req.user.sub,
      );
      return { message: 'Notification marked as read', notification };
    } catch (e) {
      throw new NotFoundException('Notification not found or unauthorized');
    }
  }
}

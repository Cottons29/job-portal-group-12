import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(AuthenticatedGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(
    @Req() req: any,
    @Body() body: { receiverId: string; content: string },
  ) {
    const senderId = req.user.sub;
    return this.messagesService.sendMessage(senderId, body.receiverId, body.content);
  }

  @Get('contacts')
  async getContacts(@Req() req: any) {
    const userId = req.user.sub;
    return this.messagesService.getContacts(userId);
  }

  @Get(':contactId')
  async getChatHistory(@Req() req: any, @Param('contactId') contactId: string) {
    const userId = req.user.sub;
    return this.messagesService.getChatHistory(userId, contactId);
  }
}

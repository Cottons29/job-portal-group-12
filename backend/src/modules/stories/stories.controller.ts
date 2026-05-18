import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { StoriesService } from './stories.service';

@Controller('stories')
@UseGuards(AuthenticatedGuard)
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async getStories() {
    return this.storiesService.getRecentStories();
  }

  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async createStory(
    @Req() req: any,
    @Body() body: { text?: string; bgColor?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.storiesService.createStory(
      req.user.sub,
      body.text || null,
      body.bgColor || null,
      file,
    );
  }

  @Delete(':id')
  async deleteStory(@Req() req: any, @Param('id') id: string) {
    await this.storiesService.deleteStory(id, req.user.sub);
    return { message: 'Story deleted' };
  }
}

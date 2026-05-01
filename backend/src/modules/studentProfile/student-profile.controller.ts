import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { StudentProfileService } from './student-profile.service';

@Controller('student-profile')
@UseGuards(AuthenticatedGuard)
export class StudentProfileController {
  constructor(private readonly studentProfileService: StudentProfileService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('cvFile'))
  async save(
    @Req() req: any,
    @Body() body: Record<string, unknown>,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    const userId = req.user.sub;
    const profile = await this.studentProfileService.createOrUpdateProfile(
      userId,
      body,
      file,
    );
    return { message: 'Profile saved', profile };
  }

  @Post('setup')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('cvFile'))
  async setupProfile(
    @Req() req: any,
    @Body() body: Record<string, unknown>,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    const userId = req.user.sub;
    return this.studentProfileService.createOrUpdateProfile(userId, body, file);
  }

  @Get('me')
  async getMine(@Req() req: any) {
    const userId = req.user.sub;
    const profile = await this.studentProfileService.findByUser(userId);
    return { profile };
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { StudentProfileService } from './student-profile.service';

@Controller('student-profile')
@UseGuards(AuthenticatedGuard)
export class StudentProfileController {
  constructor(private readonly studentProfileService: StudentProfileService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cvFile', maxCount: 1 },
      { name: 'profileImageFile', maxCount: 1 },
    ]),
  )
  async save(
    @Req() req: any,
    @Body() body: Record<string, unknown>,
    @UploadedFiles()
    files: {
      cvFile?: Express.Multer.File[];
      profileImageFile?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.sub;
    const profile = await this.studentProfileService.createOrUpdateProfile(
      userId,
      body,
      files?.cvFile?.[0],
      files?.profileImageFile?.[0],
    );
    return { message: 'Profile saved', profile };
  }

  @Post('setup')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cvFile', maxCount: 1 },
      { name: 'profileImageFile', maxCount: 1 },
    ]),
  )
  async setupProfile(
    @Req() req: any,
    @Body() body: Record<string, unknown>,
    @UploadedFiles()
    files: {
      cvFile?: Express.Multer.File[];
      profileImageFile?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.sub;
    return this.studentProfileService.createOrUpdateProfile(
      userId,
      body,
      files?.cvFile?.[0],
      files?.profileImageFile?.[0],
    );
  }

  @Get('me')
  async getMine(@Req() req: any) {
    const userId = req.user.sub;
    const profile = await this.studentProfileService.findByUser(userId);
    return { profile };
  }
}

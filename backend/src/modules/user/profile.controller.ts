import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';

import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { ProfileService } from './profile.service';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('profile')
@UseGuards(AuthenticatedGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  async getMine(@Req() req: any) {
    const userId = req.user.sub;
    const profile = await this.profileService.getProfile(userId);
    return { profile };
  }

  @Get('focus-stats')
  async getFocusStats(@Req() req: any) {
    const userId = req.user.sub;
    const stats = await this.profileService.getFocusStats(userId);
    return { stats };
  }

  @Get(':id')
  async getProfile(@Req() req: any) {
    const userId = req.params.id;
    const profile = await this.profileService.getProfile(userId);
    return { profile };
  }

  @Post('student/setup')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cvFile', maxCount: 1 },
      { name: 'idCardFile', maxCount: 1 },
    ]),
  )
  async setupStudent(
    @Req() req: any,
    @Body() body: any,
    @UploadedFiles()
    files: {
      cvFile?: Express.Multer.File[];
      idCardFile?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.sub;
    let role = req.user.role;

    if (!role) {
      const user = await this.profileService.getProfile(userId);
      role = user.role;
    }

    if (role !== UserRole.STUDENT) {
      throw new BadRequestException('Only students can setup a student profile');
    }

    const cvFile = files?.cvFile?.[0];
    const idCardFile = files?.idCardFile?.[0];

    return this.profileService.updateStudentProfile(
      userId,
      body,
      cvFile,
      idCardFile,
    );
  }

  @Post('employer/setup')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logoFile', maxCount: 1 },
      { name: 'patentFile', maxCount: 1 },
    ]),
  )
  async setupEmployer(
    @Req() req: any,
    @Body() body: any,
    @UploadedFiles()
    files: {
      logoFile?: Express.Multer.File[];
      patentFile?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.sub;
    let role = req.user.role;

    if (!role) {
      const user = await this.profileService.getProfile(userId);
      role = user.role;
    }

    if (role !== UserRole.EMPLOYER) {
      throw new BadRequestException('Only employers can setup an employer profile');
    }

    const logoFile = files?.logoFile?.[0];
    const patentFile = files?.patentFile?.[0];

    return this.profileService.updateEmployerProfile(
      userId,
      body,
      logoFile,
      patentFile,
    );
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cvFile', maxCount: 1 },
      { name: 'logoFile', maxCount: 1 },
      { name: 'patentFile', maxCount: 1 },
      { name: 'avatarFile', maxCount: 1 },
      { name: 'idCardFile', maxCount: 1 },
    ]),
  )
  async updateProfile(
    @Req() req: any,
    @Body() body: any,
    @UploadedFiles()
    files: {
      cvFile?: Express.Multer.File[];
      logoFile?: Express.Multer.File[];
      patentFile?: Express.Multer.File[];
      avatarFile?: Express.Multer.File[];
      idCardFile?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.sub;
    let role = req.user.role;

    if (!role) {
      const user = await this.profileService.getProfile(userId);
      role = user.role;
    }

    if (role === UserRole.STUDENT) {
      return this.profileService.updateStudentProfile(
        userId,
        body,
        files?.cvFile?.[0],
        files?.idCardFile?.[0],
        files?.avatarFile?.[0],
      );
    } else if (role === UserRole.EMPLOYER) {
      return this.profileService.updateEmployerProfile(
        userId,
        body,
        files?.logoFile?.[0] || files?.avatarFile?.[0],
        files?.patentFile?.[0],
      );
    } else {
      throw new BadRequestException('Unsupported user role for profile update');
    }
  }
}

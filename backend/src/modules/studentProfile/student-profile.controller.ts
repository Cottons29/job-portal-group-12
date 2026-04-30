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
import type { Request } from 'express';

import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { StudentProfileService } from './student-profile.service';
import { SaveStudentProfileDto } from './dto/save-student-profile.dto';

/**
 * REST surface for the student onboarding form.
 *
 * `POST /api/student-profile` is multipart so the optional CV file can be
 * attached under the `cv` field. Every endpoint requires an authenticated
 * session (cookie-based — see `AuthenticatedGuard`).
 */
@Controller('student-profile')
@UseGuards(AuthenticatedGuard)
export class StudentProfileController {
  constructor(private readonly service: StudentProfileService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('cv'))
  async save(
    @Body() body: SaveStudentProfileDto,
    @UploadedFile() cv: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    const userId = (req.session as any)?.userId;
    const profile = await this.service.save(userId, body, cv);
    return { message: 'Profile saved', profile };
  }

  @Get('me')
  async getMine(@Req() req: Request) {
    const userId = (req.session as any)?.userId;
    const profile = await this.service.findBySessionUser(userId);
    return { profile };
  }
}

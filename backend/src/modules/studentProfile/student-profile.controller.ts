import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { StudentProfileService } from './student-profile.service';

@Controller('student-profile')
export class StudentProfileController {
  constructor(private readonly studentProfileService: StudentProfileService) {}

  @Post('setup')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('cvFile'))
  async setupProfile(
    @Req() req: any,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.sub;
    
    // Parse JSON strings back to objects (since FormData sends them as strings)
    let parsedAvailability = null;
    let parsedSkills = null;
    
    try {
      if (body.availability) {
        parsedAvailability = JSON.parse(body.availability);
      }
      if (body.skills) {
        parsedSkills = JSON.parse(body.skills);
      }
    } catch (e) {
      throw new BadRequestException('Invalid JSON payload for availability or skills');
    }

    const profileData = {
      fullName: body.fullName,
      university: body.university,
      major: body.major,
      yearLevel: body.yearLevel,
      skills: parsedSkills,
      bio: body.bio,
      jobType: body.jobType,
      availability: parsedAvailability,
      expectedSalary: body.expectedSalary,
      currency: body.currency,
    };

    return this.studentProfileService.createOrUpdateProfile(userId, profileData, file);
  }
}

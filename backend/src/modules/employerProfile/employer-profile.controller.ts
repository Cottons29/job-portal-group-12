import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { EmployerProfileService } from './employer-profile.service';

@Controller('employer-profile')
export class EmployerProfileController {
  constructor(private readonly employerProfileService: EmployerProfileService) {}

  @Post('setup')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logoFile', maxCount: 1 },
      { name: 'patentFile', maxCount: 1 },
    ]),
  )
  async setupProfile(
    @Req() req: any,
    @Body() body: any,
    @UploadedFiles() files: { logoFile?: Express.Multer.File[]; patentFile?: Express.Multer.File[] },
  ) {
    const userId = req.user.sub;
    
    if (req.user.role !== 'EMPLOYER') {
      throw new BadRequestException('Only employers can setup an employer profile');
    }

    const profileData = {
      companyName: body.companyName,
      industry: body.industry,
      address: body.location, // mapping location to address
    };

    const logoFile = files.logoFile?.[0];
    const patentFile = files.patentFile?.[0];

    return this.employerProfileService.createOrUpdateProfile(userId, profileData, logoFile, patentFile);
  }
}

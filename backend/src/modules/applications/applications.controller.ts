import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { ApplicationsService } from './applications.service';
import { ApplicationStatus } from './job-application.entity';

@Controller('applications')
@UseGuards(AuthenticatedGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async apply(
    @Req() req: any,
    @Body() body: { postId: string; coverLetter?: string },
  ) {
    const application = await this.applicationsService.apply(
      req.user.sub,
      body.postId,
      body.coverLetter,
    );
    return { message: 'Application submitted', application };
  }

  @Get('me')
  async getMyApplications(@Req() req: any) {
    const applications =
      await this.applicationsService.getApplicationsForStudent(req.user.sub);
    return { applications };
  }

  @Get('post/:postId')
  async getApplicantsForPost(@Req() req: any, @Param('postId') postId: string) {
    const applications = await this.applicationsService.getApplicantsForPost(
      req.user.sub,
      postId,
    );
    return { applications };
  }

  @Patch(':id/status')
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: ApplicationStatus },
  ) {
    const application = await this.applicationsService.updateStatus(
      req.user.sub,
      id,
      body.status,
    );
    return { message: 'Status updated', application };
  }
}

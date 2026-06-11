import { Controller, Post, Get, Patch, Body, Param, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { AdminGuard } from '../../auth/admin.guard';
import * as express from 'express';

@Controller('reports')
@UseGuards(AuthenticatedGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  private getAuthenticatedUserId(req: express.Request) {
    return (
      (req as express.Request & { user?: { sub?: string } }).user?.sub ||
      req.session.userId
    );
  }

  @Post()
  async createReport(
    @Body() body: { targetType: 'post' | 'user'; targetId: string; reason: string; details?: string },
    @Req() req: express.Request,
  ) {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return await this.reportsService.createReport(
      userId,
      body.targetType,
      body.targetId,
      body.reason,
      body.details,
    );
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllReports() {
    const reports = await this.reportsService.getAllReports();
    return { reports };
  }

  @Patch(':id/resolve')
  @UseGuards(AdminGuard)
  async resolveReport(
    @Param('id') id: string,
    @Body('action') action: 'resolve' | 'dismiss',
  ) {
    await this.reportsService.resolveReport(id, action);
    return { success: true, message: `Report status updated to ${action}d` };
  }
}

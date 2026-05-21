import { Controller, Get, Patch, Delete, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getAdminStats() {
    return this.adminService.getAdminStats();
  }

  @Get('employers/pending')
  async getPendingEmployers() {
    return this.adminService.getPendingEmployers();
  }

  @Get('employers/verified')
  async getVerifiedEmployers() {
    return this.adminService.getVerifiedEmployers();
  }

  @Patch('employers/:id/approve')
  async approveEmployer(@Param('id') id: string) {
    await this.adminService.approveEmployer(id);
    return { success: true, message: 'Employer approved' };
  }

  @Delete('employers/:id/reject')
  async rejectEmployer(@Param('id') id: string) {
    await this.adminService.rejectEmployer(id);
    return { success: true, message: 'Employer rejected and deleted' };
  }

  @Patch('employers/:id/revoke')
  async revokeEmployer(@Param('id') id: string) {
    await this.adminService.revokeEmployer(id);
    return { success: true, message: 'Employer verification status revoked' };
  }
}

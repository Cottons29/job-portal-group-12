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

  @Get('students/pending')
  async getPendingStudents() {
    return this.adminService.getPendingStudents();
  }

  @Get('students/verified')
  async getVerifiedStudents() {
    return this.adminService.getVerifiedStudents();
  }

  @Patch('students/:id/approve')
  async approveStudent(@Param('id') id: string) {
    await this.adminService.approveStudent(id);
    return { success: true, message: 'Student approved' };
  }

  @Delete('students/:id/reject')
  async rejectStudent(@Param('id') id: string) {
    await this.adminService.rejectStudent(id);
    return { success: true, message: 'Student rejected and deleted' };
  }

  @Patch('students/:id/revoke')
  async revokeStudent(@Param('id') id: string) {
    await this.adminService.revokeStudent(id);
    return { success: true, message: 'Student verification status revoked' };
  }
}

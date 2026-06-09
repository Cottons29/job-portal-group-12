import { Controller, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { AdminGuard } from '../../auth/admin.guard';

@Controller('admin')
@UseGuards(AuthenticatedGuard, AdminGuard)
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

  @Get('posts/flagged')
  async getFlaggedPosts() {
    return this.adminService.getFlaggedPosts();
  }

  @Patch('posts/:id/approve')
  async approvePost(@Param('id') id: string) {
    await this.adminService.approvePost(id);
    return { success: true, message: 'Post approved' };
  }

  @Patch('posts/:id/flag')
  async flagPost(@Param('id') id: string) {
    await this.adminService.flagPost(id);
    return { success: true, message: 'Post flagged' };
  }

  @Delete('posts/:id')
  async rejectPost(@Param('id') id: string) {
    await this.adminService.rejectPost(id);
    return { success: true, message: 'Post deleted' };
  }
}

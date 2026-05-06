import { Controller, Get, Patch, Delete, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('employers/pending')
  async getPendingEmployers() {
    return this.adminService.getPendingEmployers();
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
}

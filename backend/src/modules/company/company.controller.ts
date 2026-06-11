import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompanies() {
    const companies = await this.companyService.findAll();
    return { companies };
  }

  @Get(':id')
  async getCompany(@Param('id') id: string) {
    const company = await this.companyService.findOne(id);
    return { company };
  }
}

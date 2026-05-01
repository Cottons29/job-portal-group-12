import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployerProfile } from '../employerProfile/company-profile.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(EmployerProfile)
    private readonly employerProfileRepo: Repository<EmployerProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getPendingEmployers(): Promise<EmployerProfile[]> {
    return this.employerProfileRepo.find({
      where: { isVerified: false },
      order: { createdAt: 'DESC' },
    });
  }

  async approveEmployer(id: string): Promise<void> {
    const employer = await this.employerProfileRepo.findOne({ where: { id } });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }
    employer.isVerified = true;
    await this.employerProfileRepo.save(employer);
  }

  async rejectEmployer(id: string): Promise<void> {
    const employer = await this.employerProfileRepo.findOne({ where: { id } });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }
    await this.userRepo.delete(employer.userId);
  }
}

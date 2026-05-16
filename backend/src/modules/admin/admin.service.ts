import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getPendingEmployers(): Promise<User[]> {
    return await this.userRepo.find({
      where: { role: UserRole.EMPLOYER, isVerified: false },
      order: { createdAt: 'DESC' },
    });
  }

  async approveEmployer(id: string): Promise<void> {
    const employer = await this.userRepo.findOne({
      where: { id, role: UserRole.EMPLOYER },
    });
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }
    employer.isVerified = true;
    await this.userRepo.save(employer);
  }

  async rejectEmployer(id: string): Promise<void> {
    const employer = await this.userRepo.findOne({
      where: { id, role: UserRole.EMPLOYER },
    });
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }
    await this.userRepo.delete(id);
  }
}

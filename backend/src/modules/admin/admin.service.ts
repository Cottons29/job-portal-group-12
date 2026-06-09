import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { EmailService } from '../../common/email/email.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async getPendingEmployers(): Promise<User[]> {
    return await this.userRepo.find({
      where: { role: UserRole.EMPLOYER, isVerified: false },
      order: { createdAt: 'DESC' },
    });
  }

  async getVerifiedEmployers(): Promise<User[]> {
    return await this.userRepo.find({
      where: { role: UserRole.EMPLOYER, isVerified: true },
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

    if (employer.email) {
      await this.emailService.sendVerificationApprovedEmail(
        employer.email,
        employer.fullName || employer.companyName || 'Employer',
        'EMPLOYER',
      );
    }
  }

  async rejectEmployer(id: string): Promise<void> {
    const employer = await this.userRepo.findOne({
      where: { id, role: UserRole.EMPLOYER },
    });
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }
    if (employer.email) {
      await this.emailService.sendVerificationRejectedEmail(
        employer.email,
        employer.fullName || employer.companyName || 'Employer',
        'EMPLOYER',
      );
    }
    await this.userRepo.delete(id);
  }

  async revokeEmployer(id: string): Promise<void> {
    const employer = await this.userRepo.findOne({
      where: { id, role: UserRole.EMPLOYER },
    });
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }
    employer.isVerified = false;
    await this.userRepo.save(employer);
  }

  // --- Student verification management ---
  async getPendingStudents(): Promise<User[]> {
    return await this.userRepo.find({
      where: { role: UserRole.STUDENT, isStudentVerified: false },
      order: { createdAt: 'DESC' },
    });
  }

  async approveStudent(id: string): Promise<void> {
    const student = await this.userRepo.findOne({ where: { id, role: UserRole.STUDENT } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    student.isStudentVerified = true;
    await this.userRepo.save(student);

    if (student.email) {
      await this.emailService.sendVerificationApprovedEmail(
        student.email,
        student.fullName || student.user_name || 'Student',
        'STUDENT',
      );
    }
  }

  async rejectStudent(id: string): Promise<void> {
    const student = await this.userRepo.findOne({ where: { id, role: UserRole.STUDENT } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    if (student.email) {
      await this.emailService.sendVerificationRejectedEmail(
        student.email,
        student.fullName || student.user_name || 'Student',
        'STUDENT',
      );
    }
    await this.userRepo.delete(id);
  }

  async revokeStudent(id: string): Promise<void> {
    const student = await this.userRepo.findOne({ where: { id, role: UserRole.STUDENT } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    student.isStudentVerified = false;
    await this.userRepo.save(student);
  }

  async getVerifiedStudents(): Promise<User[]> {
    return await this.userRepo.find({
      where: { role: UserRole.STUDENT, isStudentVerified: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getAdminStats() {
    const totalStudents = await this.userRepo.count({
      where: { role: UserRole.STUDENT },
    });
    const totalEmployers = await this.userRepo.count({
      where: { role: UserRole.EMPLOYER },
    });
    const verifiedEmployers = await this.userRepo.count({
      where: { role: UserRole.EMPLOYER, isVerified: true },
    });
    const pendingEmployers = await this.userRepo.count({
      where: { role: UserRole.EMPLOYER, isVerified: false },
    });

    return {
      totalStudents,
      totalEmployers,
      verifiedEmployers,
      pendingEmployers,
    };
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EmployerProfile } from '../employerProfile/company-profile.entity';
import { User } from '../user/user.entity';
import { StudentProfile } from '../studentProfile/student-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployerProfile, User, StudentProfile])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

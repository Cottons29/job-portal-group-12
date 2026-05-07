import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerProfileController } from './employer-profile.controller';
import { EmployerProfileService } from './employer-profile.service';
import { EmployerProfile } from './company-profile.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployerProfile, User])],
  controllers: [EmployerProfileController],
  providers: [EmployerProfileService],
})
export class EmployerProfileModule {}

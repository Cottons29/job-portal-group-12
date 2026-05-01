import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfileController } from './student-profile.controller';
import { StudentProfileService } from './student-profile.service';
import { StudentProfile } from './student-profile.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentProfile, User])],
  controllers: [StudentProfileController],
  providers: [StudentProfileService],
})
export class StudentProfileModule {}

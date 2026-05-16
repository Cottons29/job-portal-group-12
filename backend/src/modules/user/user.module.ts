import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StudentProfileController } from './student-profile.controller';
import { StudentProfileService } from './student-profile.service';
import { EmployerProfileController } from './employer-profile.controller';
import { EmployerProfileService } from './employer-profile.service';
import { SheepFileService } from '../../common/sheep-file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  ],
  controllers: [
    UserController,
    StudentProfileController,
    EmployerProfileController,
  ],
  providers: [
    UserService,
    StudentProfileService,
    EmployerProfileService,
    SheepFileService,
  ],
  exports: [UserService, StudentProfileService, EmployerProfileService],
})
export class UserModule {}

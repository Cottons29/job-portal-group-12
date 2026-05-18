import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
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
    ProfileController,
  ],
  providers: [
    UserService,
    ProfileService,
    SheepFileService,
  ],
  exports: [UserService, ProfileService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { SheepFileService } from '../common/sheep-file.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.register({
       storage: memoryStorage(),
       limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
     }),
  ],
  controllers: [UploadController],
  providers: [SheepFileService],
  exports: [SheepFileService],
})
export class UploadModule {}

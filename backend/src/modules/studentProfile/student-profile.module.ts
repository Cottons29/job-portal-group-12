import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { StudentProfile } from './student-profile.entity';
import { StudentProfileController } from './student-profile.controller';
import { StudentProfileService } from './student-profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentProfile]),
    // Local Multer registration (mirrors `UploadModule` settings) so the
    // FileInterceptor in the controller has somewhere to put uploaded CVs.
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  ],
  controllers: [StudentProfileController],
  providers: [StudentProfileService],
  exports: [StudentProfileService],
})
export class StudentProfileModule {}

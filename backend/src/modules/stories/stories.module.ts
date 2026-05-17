import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './story.entity';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { User } from '../user/user.entity';
import { UploadModule } from '../../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Story, User]), UploadModule],
  controllers: [StoriesController],
  providers: [StoriesService],
  exports: [StoriesService],
})
export class StoriesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/user.entity';
import { PostEntity } from '../posts/post.entity';
import { JobApplication } from './job-application.entity';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

import { NotificationsModule } from '../../notifications/notifications.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication, PostEntity, User]),
    NotificationsModule,
    MessagesModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}

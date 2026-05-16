import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsModule } from '../../notifications/notifications.module';
import { User } from '../user/user.entity';
import { PostBookmark } from './post-bookmark.entity';
import { PostComment } from './post-comment.entity';
import { PostLike } from './post-like.entity';
import { PostEntity } from './post.entity';
import { PostShare } from './post-share.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { JobApplication } from '../applications/job-application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      User,
      PostLike,
      PostComment,
      PostShare,
      PostBookmark,
      JobApplication,
    ]),
    NotificationsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

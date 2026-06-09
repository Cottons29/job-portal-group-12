import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { PostsModule } from './modules/posts/posts.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { StoriesModule } from "./modules/stories/stories.module";
import { FollowsModule } from "./modules/follows/follows.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { EmailModule } from './common/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'firststep_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EmailModule,
    AuthModule,
    UploadModule,
    NotificationsModule,
    AdminModule,
    UserModule,
    PostsModule,
    ApplicationsModule,
    StoriesModule,
    FollowsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

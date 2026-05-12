import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { StudentProfileModule } from './modules/studentProfile/student-profile.module';
import { PostsModule } from './modules/posts/posts.module';
import { EmployerProfileModule } from './modules/employerProfile/employer-profile.module';
import { ApplicationsModule } from './modules/applications/applications.module';

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
    AuthModule,
    UploadModule,
    NotificationsModule,
    AdminModule,
    StudentProfileModule,
    PostsModule,
    EmployerProfileModule,
    ApplicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

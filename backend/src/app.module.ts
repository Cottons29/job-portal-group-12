import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/entities/notification.entity';
import { User } from './modules/user/user.entity';
import { StudentProfile } from './modules/studentProfile/student-profile.entity';
import { StudentProfileModule } from './modules/studentProfile/student-profile.module';
import { EmployerProfile } from './modules/employerProfile/company-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'postgres',
      entities: [User, StudentProfile, EmployerProfile, Notification],
      synchronize: true, // dev only — auto-creates tables; disable in prod
    }),
    AuthModule,
    UploadModule,
    NotificationsModule,
    StudentProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [AuthModule, UploadModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../user/user.entity';
import { PostEntity } from '../posts/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PostEntity])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

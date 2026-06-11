import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { User } from '../user/user.entity';
import { PostEntity } from '../posts/post.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  async createReport(
    reporterId: string,
    targetType: 'post' | 'user',
    targetId: string,
    reason: string,
    details?: string,
  ): Promise<Report> {
    const report = new Report();
    report.reporterId = reporterId;
    report.targetType = targetType;
    report.reason = reason;
    report.details = details;

    if (targetType === 'post') {
      const post = await this.postRepo.findOne({ where: { id: targetId } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      report.targetPostId = targetId;
      
      // Auto-flag the post if it receives a report to bring it to admin attention
      post.status = 'flagged';
      await this.postRepo.save(post);
    } else if (targetType === 'user') {
      const user = await this.userRepo.findOne({ where: { id: targetId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      report.targetUserId = targetId;
    }

    return await this.reportRepo.save(report);
  }

  async getAllReports(): Promise<Report[]> {
    return await this.reportRepo.find({
      relations: ['reporter', 'targetPost', 'targetUser', 'targetPost.author'],
      order: { createdAt: 'DESC' },
    });
  }

  async resolveReport(id: string, action: 'resolve' | 'dismiss'): Promise<void> {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = action === 'resolve' ? 'resolved' : 'dismissed';
    await this.reportRepo.save(report);
  }
}

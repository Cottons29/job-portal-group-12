import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { PostEntity } from '../posts/post.entity';
import { ApplicationStatus, JobApplication } from './job-application.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly appRepo: Repository<JobApplication>,
    @InjectRepository(PostEntity)
    private readonly postsRepo: Repository<PostEntity>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async apply(studentId: string, postId: string, coverLetter?: string) {
    const post = await this.postsRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    // Prevent employers from applying
    const student = await this.usersRepo.findOne({ where: { id: studentId } });
    if (!student || student.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can apply to posts.');
    }

    // Prevent duplicate applications
    const existing = await this.appRepo.findOne({
      where: { applicant: { id: studentId }, post: { id: postId } },
    });
    if (existing) {
      throw new ConflictException('You have already applied to this post.');
    }

    if (coverLetter && coverLetter.length > 3000) {
      throw new BadRequestException('Cover letter is too long (max 3000 characters).');
    }

    const application = this.appRepo.create({
      applicant: student,
      post,
      coverLetter: coverLetter?.trim() || undefined,
    });

    return this.appRepo.save(application);
  }

  async getApplicationsForStudent(studentId: string) {
    return this.appRepo.find({
      where: { applicant: { id: studentId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getApplicantsForPost(employerId: string, postId: string) {
    const post = await this.postsRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    // Only the post author (employer) can view applicants
    if (post.author.id !== employerId) {
      throw new ForbiddenException('You are not the author of this post.');
    }

    return this.appRepo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(employerId: string, applicationId: string, status: ApplicationStatus) {
    const application = await this.appRepo.findOne({ where: { id: applicationId } });
    if (!application) {
      throw new NotFoundException('Application not found.');
    }

    if (application.post.author.id !== employerId) {
      throw new ForbiddenException('You are not the author of this post.');
    }

    application.status = status;
    return this.appRepo.save(application);
  }
}

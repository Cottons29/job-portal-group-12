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

import { NotificationsService } from '../../notifications/notifications.service';
import { EmailService } from '../../common/email/email.service';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly appRepo: Repository<JobApplication>,
    @InjectRepository(PostEntity)
    private readonly postsRepo: Repository<PostEntity>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
    private readonly messagesService: MessagesService,
  ) {}

  async apply(studentId: string, postId: string, coverLetter?: string, cvUrl?: string) {
    const post = await this.postsRepo.findOne({
      where: { id: postId },
      relations: ['author'],
    });
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
      throw new BadRequestException(
        'Cover letter is too long (max 3000 characters).',
      );
    }

    const application = this.appRepo.create({
      applicant: student,
      post,
      coverLetter: coverLetter?.trim() || undefined,
      cvUrl: cvUrl?.trim() || undefined,
    });

    const savedApp = await this.appRepo.save(application);

    // Notify the employer who authored the post
    if (post.author?.id) {
      await this.notificationsService.createNotification(
        post.author.id,
        `New job application received from ${student.user_name || 'a student'} for your post: "${post.title}"`,
      );

      if (post.author.email) {
        await this.emailService.sendApplicationSubmittedEmail(
          post.author.email,
          post.author.fullName || post.author.companyName || 'Employer',
          student.fullName || student.user_name || 'A Student',
          post.title,
        );
      }
    }

    return savedApp;
  }

  async getApplicationsForStudent(studentId: string) {
    return await this.appRepo.find({
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

    return await this.appRepo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    employerId: string,
    applicationId: string,
    status: ApplicationStatus,
  ) {
    const application = await this.appRepo.findOne({
      where: { id: applicationId },
      relations: ['post', 'post.author', 'applicant'],
    });
    if (!application) {
      throw new NotFoundException('Application not found.');
    }

    if (application.post?.author?.id !== employerId) {
      throw new ForbiddenException('You are not the author of this post.');
    }

    application.status = status;
    const savedApp = await this.appRepo.save(application);

    // Notify the student applicant about the status update
    if (application.applicant?.id) {
      await this.notificationsService.createNotification(
        application.applicant.id,
        `Your job application status for "${application.post.title}" has been updated to: ${status}`,
      );

      if (application.applicant.email) {
        await this.emailService.sendApplicationStatusUpdatedEmail(
          application.applicant.email,
          application.applicant.fullName || application.applicant.user_name || 'Student',
          application.post.title,
          status,
          application.post.author?.companyName || application.post.author?.fullName || 'Employer',
        );
      }
    }

    return savedApp;
  }

  async respondToOffer(
    studentId: string,
    applicationId: string,
    response: 'ACCEPT' | 'DECLINE',
  ) {
    const application = await this.appRepo.findOne({
      where: { id: applicationId },
      relations: ['post', 'post.author', 'applicant'],
    });
    if (!application) {
      throw new NotFoundException('Application not found.');
    }

    if (application.applicant?.id !== studentId) {
      throw new ForbiddenException('You do not own this application.');
    }

    if (application.status !== ApplicationStatus.ACCEPTED) {
      throw new BadRequestException('You can only respond to accepted offers.');
    }

    application.status =
      response === 'ACCEPT'
        ? ApplicationStatus.HIRED
        : ApplicationStatus.DECLINED;

    const savedApp = await this.appRepo.save(application);

    // Notify the employer who sent the offer
    if (application.post?.author?.id) {
      const studentName =
        application.applicant.fullName ||
        application.applicant.user_name ||
        'A student';
      const statusText = response === 'ACCEPT' ? 'accepted' : 'declined';

      await this.notificationsService.createNotification(
        application.post.author.id,
        `${studentName} has ${statusText} your job offer for "${application.post.title}"!`,
      );

      // Email employer
      if (application.post.author.email) {
        await this.emailService.sendOfferResponseEmail(
          application.post.author.email,
          application.post.author.fullName ||
            application.post.author.companyName ||
            'Employer',
          studentName,
          application.post.title,
          response,
        );
      }

      // Automate onboarding chat thread when offer is accepted
      if (response === 'ACCEPT') {
        const welcomeMessage = `Hi ${studentName}, welcome to the team! We are absolutely thrilled to have you join us for the "${application.post.title}" role. Let's use this chat to coordinate the next steps of your onboarding process and finalize your start details.`;
        try {
          await this.messagesService.sendMessage(
            application.post.author.id,
            studentId,
            welcomeMessage,
          );
        } catch (msgErr) {
          console.error('Failed to send automated onboarding message:', msgErr);
        }
      }
    }

    return savedApp;
  }
}

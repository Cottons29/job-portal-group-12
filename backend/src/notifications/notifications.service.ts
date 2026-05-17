import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Notification } from './entities/notification.entity';
import { User } from '../modules/user/user.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'no-reply@firststep.com',
      pass: process.env.GMAIL_PASS || 'mock-pass',
    },
  });

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createNotification(
    userId: string,
    message: string,
  ): Promise<Notification> {
    // 1. Save to the PostgreSQL database
    const notification = this.notificationRepository.create({
      userId,
      message,
    });
    const savedNotification =
      await this.notificationRepository.save(notification);

    // 2. Emit the real-time event to the specific connected user
    this.notificationsGateway.emitNotification(userId, savedNotification);

    // 3. Dispatch an email copy asynchronously
    this.sendEmailNotification(userId, message).catch(err => {
      console.error('Failed to send email notification:', err);
    });

    return savedNotification;
  }

  private async sendEmailNotification(userId: string, message: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.email) return;

    await this.transporter.sendMail({
      from: `"FirstStep Notifications" <${process.env.GMAIL_USER || 'no-reply@firststep.com'}>`,
      to: user.email,
      subject: 'New update on your FirstStep account',
      text: `${message}\n\nView details in your FirstStep application dashboard.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #1a4fa3; margin-top: 0;">FirstStep Notification</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.5;">${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">You are receiving this update because your email is linked to FirstStep platform activities.</p>
        </div>
      `,
    });
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.isRead = true;
    return await this.notificationRepository.save(notification);
  }
}

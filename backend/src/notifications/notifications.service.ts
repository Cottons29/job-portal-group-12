import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
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

    return savedNotification;
  }
  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
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
    return this.notificationRepository.save(notification);
  }
}

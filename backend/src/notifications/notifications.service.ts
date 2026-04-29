import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * 1. Persist the notification to PostgreSQL.
   * 2. Push it to the user in real-time via the WebSocket gateway.
   *
   * Returns the saved Notification entity (includes the generated id & timestamps).
   */
  async createNotification(
    userId: string,
    message: string,
  ): Promise<Notification> {
    // ── Step 1: Save to database ──────────────────────────────────
    const notification = this.notificationRepo.create({
      userId,
      message,
    });
    const saved = await this.notificationRepo.save(notification);

    this.logger.log(
      `Notification ${saved.id} persisted for user ${userId}`,
    );

    // ── Step 2: Push via WebSocket ────────────────────────────────
    this.notificationsGateway.emitToUser(userId, {
      id: saved.id,
      userId: saved.userId,
      message: saved.message,
      isRead: saved.isRead,
      createdAt: saved.createdAt,
    });

    return saved;
  }
}

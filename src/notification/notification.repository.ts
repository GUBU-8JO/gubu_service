import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  async findUnreadNotifications(userId: number) {
    return this.repository.find({
      where: { userId, isRead: false },
      relations: ['userSubscription', 'userSubscription.subscriptionHistory'],
      order: { createdAt: 'DESC' },
    });
  }

  async findReadNotifications(userId: number) {
    return this.repository.find({
      where: { userId, isRead: true },
      relations: ['userSubscription', 'userSubscription.subscriptionHistory'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAllAsRead(userId: number) {
    return this.repository.update({ userId, isRead: false }, { isRead: true });
  }

  async countUnreadNotifications(userId: number) {
    return this.repository.count({ where: { userId, isRead: false } });
  }

  async findAllNotifications(userId: number) {
    const unreadNotifications = await this.findUnreadNotifications(userId);
    const readNotifications = await this.findReadNotifications(userId);

    return [...unreadNotifications, ...readNotifications];
  }
}

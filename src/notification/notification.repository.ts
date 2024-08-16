import { EntityRepository, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {

  async findUnreadNotifications(userId: number) {
    return this.find({
      where: { userId, isRead: false },
      relations: ['userSubscription', 'userSubscription.subscriptionHistory'],
      select: ['id', 'title', 'isRead', 'userSubscription', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findReadNotifications(userId: number) {
    return this.find({
      where: { userId, isRead: true },
      relations: ['userSubscription', 'userSubscription.subscriptionHistory'],
      select: ['id', 'title', 'isRead', 'userSubscription', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAllAsRead() {
    return this.update({ isRead: false }, { isRead: true });
  }

  async countUnreadNotifications(userId: number) {
    return this.count({ where: { userId, isRead: false } });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationRepository } from './notification.repository';
import { NotificationVo } from './dto/notificationVo';
import { CountVo } from './dto/countVo';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async findAll(userId: number): Promise<NotificationVo[]> {
    const unreadNotifications = await this.notificationRepository.findUnreadNotifications(userId);
    const readNotifications = await this.notificationRepository.findReadNotifications(userId);

    const notifications = [...unreadNotifications, ...readNotifications];

    if (!notifications.length) {
      return [];
    }

    await this.notificationRepository.markAllAsRead();

    return notifications.map(
      (notification) =>
        new NotificationVo(
          notification.id,
          notification.title,
          notification.isRead,
          notification.createdAt,
          [notification.userSubscription],
          notification.userSubscription.subscriptionHistory,
        ),
    );
  }

  /** 알림 한가지 조회 */
  async findOne(
    userId: number,
    notificationId: number,
  ): Promise<NotificationVo> {
    const notification = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.userSubscription', 'userSubscription')
      .leftJoinAndSelect('userSubscription.subscriptionHistory', 'subscriptionHistory')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.id = :notificationId', { notificationId })
      .getOne();

    if (!notification) {
      throw new NotFoundException('알림이 존재하지 않습니다.');
    }

    return new NotificationVo(
      notification.id,
      notification.title,
      notification.isRead,
      notification.createdAt,
      [notification.userSubscription],
    );
  }

  /** 미확인 알림 카운트 */
  async countNotifications(userId: number): Promise<CountVo> {
    const count = await this.notificationRepository.countUnreadNotifications(userId);

    if (count === 0) {
      throw new NotFoundException('모든 알림을 확인하셨습니다.');
    }

    return new CountVo(count);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { CountVo } from './dto/countVo';
import { NotificationVo } from './dto/notificationVo';
import _ from 'lodash';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findAll(userId: number): Promise<NotificationVo[]> {
    const notReadNotifications = await this.notificationRepository.find({
      where: { userId, isRead: false },
      relations: ['userSubscription', 'userSubscription.subscriptionHistory'],
      select: ['id', 'title', 'isRead', 'userSubscription', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    const readNotifications = await this.notificationRepository.find({
      where: { userId, isRead: true },
      relations: ['userSubscription', 'userSubscription.subscriptionHistory'],
      select: ['id', 'title', 'isRead', 'userSubscription', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    const notifications = [...notReadNotifications, ...readNotifications];

    if (!notifications.length || !notifications) {
      return [];
    }

    await this.notificationRepository.update(
      { isRead: false },
      { isRead: true },
    );

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
      .leftJoinAndSelect(
        'userSubscription.subscriptionHistory',
        'subscriptionHistory',
      )
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
    const countNotifications = await this.notificationRepository.findAndCountBy(
      {
        user: {
          id: userId,
        },
        isRead: false,
      },
    );
    const [_, count] = countNotifications;
    if (count === 0) {
      throw new NotFoundException('모든 알림을 확인하셨습니다.');
    }
    return new CountVo(count);
  }
}

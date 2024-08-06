import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import _ from 'lodash';
import { SubscriptionHistory } from 'src/user/entities/subscription-histories.entity';
import { NotificationVo } from './dto/notificationVo';
import { CountVo } from './dto/countVo';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserSubscription)
    private userSubscriptionsRepository: Repository<UserSubscription>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(SubscriptionHistory)
    private subscriptionHistoriesRepository: Repository<SubscriptionHistory>,
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

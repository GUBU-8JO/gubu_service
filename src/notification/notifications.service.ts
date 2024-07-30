import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import _ from 'lodash';
import { SubscriptionHistory } from 'src/user/entities/subscription-histories.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserSubscription)
    private userSubscriptionsRepository: Repository<UserSubscription>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(SubscriptionHistory)
    private subscriptionHistoriesRepository: Repository<SubscriptionHistory>,
  ) {}

  /** 알림 목록 조회 */
  async findAll(userId: number) {
    // 미확인 알림 조회
    const notReadNotifications = await this.notificationRepository.find({
      where: {
        userId,
        isRead: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    // 확인 알림 조회
    const readNotifications = await this.notificationRepository.find({
      where: {
        userId,
        isRead: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!notReadNotifications && readNotifications) {
      throw new NotFoundException('알림 목록이 존재하지 않습니다');
    }

    // 전체 알림 목록 만들기
    const notifications = [...notReadNotifications, ...readNotifications];
    return notifications;
  }

  /** 알림 한가지 조회 */
  async findOne(userId: number, notificationId: number) {
    const notification = await this.notificationRepository.findOne({
      where: {
        userId,
        id: notificationId,
      },
    });
    if (!notification) {
      throw new NotFoundException('알림이 존재하지 않습니다.');
    }
    return notification;
  }

  /** 미확인 알림 카운트 */
  async countNotifications(userId: number) {
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

    return count;
  }
}

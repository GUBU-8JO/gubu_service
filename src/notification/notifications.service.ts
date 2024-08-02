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

  /** 알림 목록 조회 */
  async findAll(userId: number): Promise<NotificationVo[]> {
    // tutor: queryBuilder 사용하진 이유가 있나요? 쿼리 빌더로 이렇게 사용하실거면 repository 파일 별도로 생성하셔서 작성하는것이 좋습니다. 아래 모든 함수 포함

    // 미확인 알림 조회
    const notReadNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.userSubscription', 'userSubscription')
      .leftJoinAndSelect(
        'userSubscription.subscriptionHistory',
        'subscriptionHistory',
      )
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.isRead = :isRead', { isRead: false })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();

    // 확인 알림 조회
    const readNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.userSubscription', 'userSubscription')
      .leftJoinAndSelect(
        'userSubscription.subscriptionHistory',
        'subscriptionHistory',
      )
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.isRead = :isRead', { isRead: true })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();

    if (!notReadNotifications && readNotifications) {
      throw new NotFoundException('알림 목록이 존재하지 않습니다');
    }

    // 전체 알림 목록 만들기
    const notifications = [...notReadNotifications, ...readNotifications];
    return notifications.map(
      (notification) =>
        new NotificationVo(
          notification.id,
          notification.title,
          notification.isRead,
          [notification.userSubscription],
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

    // tutor: 이건 에러가 아니고 그냥 CountVo(0) 해도 됩니다 즉 if 문 로직이 불필요합니다. 왜냐면 알림을 다본것은 에러가 아니니깐요
    if (count === 0) {
      throw new NotFoundException('모든 알림을 확인하셨습니다.');
    }

    return new CountVo(count);
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { UserSubscriptions } from 'src/user/entities/user-subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import _ from 'lodash';
import { count } from 'console';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserSubscriptions)
    private userSubscriptionsRepository: Repository<UserSubscriptions>,
    @InjectRepository(Notifications)
    private notificationRepository: Repository<Notifications>,
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
      throw new NotFoundException('알림 목록이 존재하지 않습니다.');
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

    if (!countNotifications) {
      throw new NotFoundException('모든 알림을 확인하셨습니다.');
    }
    const [_, count] = countNotifications;
    return count;
  }

  @Cron('00 53 14 * * *')
  async handleCron() {
    this.logger.debug('알림 테스트');

    // 구독 정보 가져오기
    const userSubscription = await this.userSubscriptionsRepository.find({
      relations: ['user'],
    });
    console.log(userSubscription);

    // today 설정
    const today = new Date();
    // 날짜만 필요해서 시간은 초기화
    today.setHours(0, 0, 0, 0);
    console.log('today', today);
    // 유저의 구독정보를 돌면서 결제 시작일 가져오기
    userSubscription.forEach((userSubscription) => {
      // 결제일 설정(일단, 결제 시작일)
      const payDate = userSubscription.startedDate;
      console.log('payDate', payDate);
      // 알람일 설정(결제일 -1)
      const notifyingDate = new Date(payDate);
      notifyingDate.setDate(notifyingDate.getDate() - 1);
      notifyingDate.setHours(0, 0, 0, 0);
      console.log('notifyingDate', notifyingDate);

      // today와 notifyingDate 비교
      if (notifyingDate.getDate() == today.getDate()) {
        const message = '결제일 1일 전입니다.';
        console.log(message);
        return message;
      }
    });
  }
}

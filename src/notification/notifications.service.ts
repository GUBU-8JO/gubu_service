import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationVo } from './dto/notificationVo';
import { CountVo } from './dto/countVo';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAll(userId: number): Promise<NotificationVo[]> {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.userSubscription', 'userSubscription')
      .leftJoinAndSelect(
        'userSubscription.subscriptionHistory',
        'subscriptionHistory',
      )
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();

    if (notifications.length === 0) {
      return [];
    }

    await this.notificationRepository.update(
      { userId, isRead: false },
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

  async countNotifications(userId: number): Promise<CountVo> {
    const count = await this.notificationRepository.count({
      where: { userId, isRead: false },
    });

    if (count === 0) {
      throw new NotFoundException('모든 알림을 확인하셨습니다.');
    }

    return new CountVo(count);
  }
}

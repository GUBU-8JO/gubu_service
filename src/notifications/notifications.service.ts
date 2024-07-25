import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { UserSubscriptions } from 'src/user-subscriptions/entities/user-subscription.entity';
import { Users } from 'src/users/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(UserSubscriptions)
    private userSubscriptionsRepository: Repository<UserSubscriptions>,
    @InjectRepository(Notifications)
    private notificationRepository: Repository<Notifications>,
  ) {}

  @Cron('00 49 18 * * *')
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

  // create(createNotificationDto: CreateNotificationDto) {
  //   return 'This action adds a new notification';
  // }

  // findAll() {
  //   return `This action returns all notifications`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} notification`;
  // }

  // update(id: number, updateNotificationDto: UpdateNotificationDto) {
  //   return `This action updates a #${id} notification`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }
  // }
}

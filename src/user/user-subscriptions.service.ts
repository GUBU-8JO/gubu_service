import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscription } from './entities/user-subscription.entity';
import { Repository } from 'typeorm';
import { Platform } from 'src/platform/entities/platforms.entity';
import _ from 'lodash';
import { UserSubscriptionsSerVo } from './dto/user-subscription-responseDto/create-service-subscription-response.dto';
import { SubscriptionHistory } from './entities/subscription-histories.entity';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
    @InjectRepository(SubscriptionHistory)
    private readonly subscriptionHistory: Repository<SubscriptionHistory>,
  ) {}

  async create(
    {
      startedDate,
      paymentMethod,
      period,
      accountId,
      accountPw,
    }: CreateUserSubscriptionDto,
    userId: number,
    platformId: number,
  ): Promise<UserSubscriptionsSerVo> {
    const existPlatform = await this.platformRepository.findOne({
      where: { id: platformId },
    });

    if (!existPlatform)
      throw new NotFoundException({
        status: 404,
        message: '등록되지않는 플랫폼입니다.',
      });

    // platform 가격 가져오기
    const platformPrice = existPlatform.price;

    // startedDate를 Date 객체로 변환
    const startedDateObj = new Date(startedDate);

    const data = await this.userSubscriptionRepository.save({
      startedDate,
      paymentMethod,
      period,
      accountId,
      accountPw,
      userId,
      platformId,
    });

    const nextDate = this.calculateNextDate(startedDateObj, period);

    const subscriptionHistory = await this.subscriptionHistory.save({
      userSubscriptionId: data.id,
      startedDate: startedDateObj,
      nextDate,
      price: platformPrice,
      stopDate: null,
      userSubscription: data,
    });

    return new UserSubscriptionsSerVo(
      data.startedDate,
      data.paymentMethod,
      data.period,
      data.accountId,
      data.accountPw,
      data.userId,
      data.platformId,
    );
  }
  // 다음 날짜 계산 함수 (월 단위로 증가)
  private calculateNextDate(startedDate: Date, period: number): Date {
    const nextDate = new Date(startedDate);
    nextDate.setMonth(nextDate.getMonth() + period); // period 만큼 월 증가
    return nextDate;
  }

  async findAllMe(userId: number) {
    const data = await this.userSubscriptionRepository.find({
      where: { userId },
    });
    if (!data.length)
      throw new NotFoundException({
        status: 404,
        message: '해당 유저에 대한 등록된 구독목록이 없습니다.',
      });
    return data;
  }

  async findOne(id: number) {
    const data = await this.userSubscriptionRepository.findOne({
      where: { id },
    });
    return data;
  }

  async update(
    id: number,
    {
      startedDate,
      paymentMethod,
      period,
      accountId,
      accountPw,
    }: UpdateUserSubscriptionDto,
  ) {
    const existUserSubscription = await this.userSubscriptionRepository.findOne(
      {
        where: { id },
      },
    );

    if (!existUserSubscription)
      throw new NotFoundException({ message: '등록되지않는 구독정보입니다.' });

    await this.userSubscriptionRepository.update(
      { id },
      {
        startedDate,
        paymentMethod,
        period,
        accountId,
        accountPw,
      },
    );

    const data = await this.userSubscriptionRepository.findOne({
      where: { id },
    });

    return data;
  }

  async remove(id: number) {
    await this.userSubscriptionRepository.delete({ id });
    const existData = this.userSubscriptionRepository.findOne({
      where: { id },
    });
    console.log(existData);
    if (_.isNil(existData))
      throw new BadRequestException({
        message: 'data가 정상적으로 삭제되지 않았습니다.',
      });
    return true;
  }
}

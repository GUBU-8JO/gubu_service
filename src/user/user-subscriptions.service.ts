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
import { SubscriptionHistory } from './entities/subscription-histories.entity';
import _ from 'lodash';
import { UserSubscriptionVo } from './dto/user-subscription-responseDto/userSubscriptionVo';
import { UserSubscriptionUpdateVo } from './dto/userSubscriptionUpdateVo';
import { SubscriptionHistoryVo } from './dto/user-subscription-responseDto/subscriptionHistoryVo';
import { PlatformVo } from "../category/dto/platformVo";

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
      price,
    }: CreateUserSubscriptionDto,
    userId: number,
    platformId: number,
  ): Promise<UserSubscriptionVo> {
    const existPlatform = await this.platformRepository.findOne({
      where: { id: platformId },
    });

    if (!existPlatform)
      throw new NotFoundException({
        status: 404,
        message: '등록되지않은 플랫폼입니다.',
      });

    const existingSubscription = await this.userSubscriptionRepository.findOne({
      where: {
        userId: userId,
        platformId: platformId,
      },
    });

    if (existingSubscription)
      throw new BadRequestException({
        message: '이미 구독중인 플랫폼 입니다.',
      });

    // platform 가격 가져오기
    // const platformPrice = existPlatform.price;

    // startedDate를 Date 객체로 변환
    const startedDateObj = new Date(startedDate);

    const data = await this.userSubscriptionRepository.save({
      startedDate,
      paymentMethod,
      period,
      platformId,
      accountId,
      accountPw,
      userId,
      price,
    });

    const nextDate = this.calculateNextDate(startedDateObj, period);

    await this.subscriptionHistory.save({
      userSubscriptionId: data.id,
      startedDate: startedDateObj,
      nextDate,
      price: data.price,
      stopDate: null,
      userSubscription: data,
    });

    return new UserSubscriptionVo(
      data.id,
      data.platformId,
      data.period,
      data.price,
      data.paymentMethod,
      data.startedDate,
      data.accountId,
      data.accountPw,
      data.userId,
    );
  }
  // 다음 날짜 계산 함수 (월 단위로 증가)
  private calculateNextDate(startedDate: Date, period: number): Date {
    const nextDate = new Date(startedDate);
    nextDate.setMonth(nextDate.getMonth() + period); // period 만큼 월 증가
    return nextDate;
  }

  async findAllMe(userId: number): Promise<UserSubscriptionVo[]> {
    const data = await this.userSubscriptionRepository.find({
      where: { userId },
      select: [
        'id',
        'platformId',
        'period',
        'price',
        'startedDate',
        'paymentMethod',
      ],
      relations: ['platform'],
    });
    if (!data.length)
      throw new NotFoundException({
        status: 404,
        message: '해당 유저에 대한 등록된 구독목록이 없습니다.',
      });

    return data.map((subscription) => {
      return new UserSubscriptionVo(
        subscription.id,
        subscription.platformId,
        subscription.period,
        subscription.price,
        subscription.startedDate,
        subscription.paymentMethod,
      );
    });
  }
  // platform / history 릴레이션으로 전체 다 출력하기

  async findOne(id: number): Promise<UserSubscriptionVo> {
    const data = await this.userSubscriptionRepository.findOne({
      where: { id },
      select: [
        'id',
        'platformId',
        'period',
        'price',
        'paymentMethod',
        'startedDate',
        'accountId',
        'accountPw',
        'userId',
      ],
      relations: ['platform', 'subscriptionHistory'],
    });
    if (!data) {
      throw new NotFoundException(`해당하는 구독정보가 없습니다.`);
    }

    const platform = data.platform; // 단일 Platform 객체
    const platformVo = new PlatformVo(
      platform.id,
      platform.title,
      platform.price,
      platform.image,
      platform.purchaseLink,
      platform.period,
      platform.rating,
    );


    const subscriptionHistoryVos = data.subscriptionHistory.map(
      (history) =>
        new SubscriptionHistoryVo(
          history.id,
          history.userSubscriptionId,
          history.price,
          history.startAt,
          history.nextPayAt,
          history.stopRequestAt,
        ),
    );

    return new UserSubscriptionVo(
      data.id,
      data.platformId,
      data.period,
      data.price,
      data.paymentMethod,
      data.startedDate,
      data.accountId,
      data.accountPw,
      data.userId,
      subscriptionHistoryVos,
      platformVo
    );
  }
  // platform / history 릴레이션으로 전체 다 출력하기

  async update(
    id: number,
    {
      startedDate,
      paymentMethod,
      period,
      accountId,
      accountPw,
    }: UpdateUserSubscriptionDto,
  ): Promise<UserSubscriptionUpdateVo> {
    const existUserSubscription = await this.userSubscriptionRepository.findOne(
      {
        where: { id },
      },
    );

    if (!existUserSubscription)
      throw new NotFoundException({ message: '등록되지않는 구독정보입니다.' });
    const newdata =
      existUserSubscription.startedDate === startedDate &&
      existUserSubscription.paymentMethod === paymentMethod &&
      existUserSubscription.period === period &&
      existUserSubscription.accountId === accountId &&
      existUserSubscription.accountPw === accountPw;
    if (!newdata) {
      throw new BadRequestException({ message: '변경된 정보가 없습니다.' });
    }
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

    return new UserSubscriptionUpdateVo(
      data.startedDate,
      data.paymentMethod,
      data.period,
      data.accountId,
      data.accountPw,
    );
  }

  async remove(id: number) {
    const existData = await this.userSubscriptionRepository.findOne({
      where: { id },
      withDeleted: false,
    });
    if (_.isNil(existData))
      throw new BadRequestException({
        message: '데이터가 존재하지 않습니다.',
      });

    await this.userSubscriptionRepository.softDelete(id);

    return true;
  }
}

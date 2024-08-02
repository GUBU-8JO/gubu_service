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
import { number } from 'joi';
import { UserSubscriptionUpdateVo } from './dto/userSubscriptionUpdateVo';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
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
  ): Promise<UserSubscriptionVo> {
    const existPlatform = await this.platformRepository.findOne({
      where: { id: platformId },
    });

    if (!existPlatform)
      throw new NotFoundException({
        status: 404,
        message: '등록되지않는 플랫폼입니다.',
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

    const data = await this.userSubscriptionRepository.save({
      startedDate,
      paymentMethod,
      period,
      platformId,
      accountId,
      accountPw,
      userId,
    });
    return new UserSubscriptionVo(
      data.id,
      data.startedDate,
      data.period,
      data.platformId,
      data.paymentMethod,
      data.accountId,
      data.accountPw,
      data.userId,
    );
  }

  // const latestSubscriptionHistory = subscription.subscriptionHistory?.[0];
  // const price = latestSubscriptionHistory?.price ?? null;
  async findAllMe(userId: number): Promise<UserSubscriptionVo[]> {
    const data = await this.userSubscriptionRepository.find({
      where: { userId },
      select: ['id', 'startedDate', 'period', 'platformId'],
      relations: ['subscriptionHistory', 'platform'],
    });
    if (!data.length)
      throw new NotFoundException({
        status: 404,
        message: '해당 유저에 대한 등록된 구독목록이 없습니다.',
      });

    return data.map((subscription) => {
      // const price =
      // subscription.subscriptionHistory?.map((history) => history.price) ?? [];
      return new UserSubscriptionVo(
        subscription.id,
        subscription.startedDate,
        subscription.period,
        subscription.platformId,
        subscription.paymentMethod,
        subscription.accountId,
        subscription.accountPw,
        subscription.userId,
        // price, // price 배열 전달
      );
    });
  }

  async findOne(id: number): Promise<UserSubscriptionVo> {
    const data = await this.userSubscriptionRepository.findOne({
      where: { id },
      relations: { subscriptionHistory: true },
      select: [
        'id',
        'startedDate',
        'paymentMethod',
        'period',
        'platformId',
        'accountId',
        'accountPw',
      ],
    });
    if (!data) {
      throw new NotFoundException(`해당하는 구독정보가 없습니다.`);
    }

    const price = data.subscriptionHistory?.[0]?.price ?? null;
    console.log(data.subscriptionHistory);
    // const price =
    // data.subscriptionHistory?.map((history) => history.price) ?? [];
    return new UserSubscriptionVo(
      data.id,
      data.startedDate,
      data.period,
      data.platformId,
      data.paymentMethod,
      data.accountId,
      data.accountPw,
      data.userId,
      data.subscriptionHistory,
    );
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

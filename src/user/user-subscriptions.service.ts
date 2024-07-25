import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscriptions } from './entities/user-subscription.entity';
import { Repository } from 'typeorm';
import { Platforms } from 'src/platform/entities/platforms.entity';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(UserSubscriptions)
    private readonly userSubscriptionRepository: Repository<UserSubscriptions>,
    @InjectRepository(Platforms)
    private readonly platformRepository: Repository<Platforms>,
  ) {}

  async create({
    userId,
    platformId,
    startedDate,
    paymentMethod,
    period,
    accountId,
    accountPw,
  }: CreateUserSubscriptionDto) {
    const existPlatform = await this.platformRepository.findOne({
      where: { id: platformId },
    });

    if (!existPlatform)
      throw new NotFoundException({
        status: 404,
        message: '등록되지않는 플랫폼입니다.',
      });

    const data = await this.userSubscriptionRepository.save({
      startedDate,
      paymentMethod,
      period,
      accountId,
      accountPw,
      userId,
      platformId,
    });
    return data;
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

  remove(id: number) {
    return `This action removes a #${id} userSubscription`;
  }
}

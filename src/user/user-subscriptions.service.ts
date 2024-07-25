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
    if (!data)
      throw new NotFoundException({
        status: 404,
        message: '해당 유저에 대한 등록된 구독목록이 없습니다.',
      });
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSubscription`;
  }

  update(id: number, updateUserSubscriptionDto: UpdateUserSubscriptionDto) {
    return `This action updates a #${id} userSubscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSubscription`;
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscriptions } from './entities/user-subscription.entity';
import { Repository } from 'typeorm';
import { Platforms } from 'src/platform/entities/platforms.entity';
import _ from 'lodash';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(UserSubscriptions)
    private readonly userSubscriptionRepository: Repository<UserSubscriptions>,
    @InjectRepository(Platforms)
    private readonly platformRepository: Repository<Platforms>,
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
  ) {
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

import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserSubscription } from './entities/user-subscription.entity';

@Injectable()
export class UserSubscriptionRepository extends Repository<UserSubscription> {
  constructor(private dataSource: DataSource) {
    super(UserSubscription, dataSource.createEntityManager());
  }

  async findAllMe(userId: number) {
    const userSubData = await this.find({
      where: { userId },
      select: [
        'id',
        'platformId',
        'period',
        'price',
        'startedDate',
        'paymentMethod',
      ],
      relations: ['platform', 'subscriptionHistory'],
    });
    return userSubData;
  }

  async findOne(id): Promise<UserSubscription> {
    const findUserSub = await this.find({
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
    return findUserSub[0];
  }
}

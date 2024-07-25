import { Injectable } from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscriptions } from './entities/user-subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(UserSubscriptions)
    private readonly userSubscriptionRepository: Repository<UserSubscriptions>,
  ) {}

  create({
    startedDate,
    paymentMethod,
    period,
    accountId,
    accountPw,
    userId,
    platformId,
  }: CreateUserSubscriptionDto) {
    const data = this.userSubscriptionRepository.save({
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

  findAll() {
    return `This action returns all userSubscriptions`;
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

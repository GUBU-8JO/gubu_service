import { PickType } from '@nestjs/swagger';
import { UserSubscriptions } from '../entities/user-subscription.entity';

export class CreateUserSubscriptionDto extends PickType(UserSubscriptions, [
  'startedDate',
  'paymentMethod',
  'period',
  'accountId',
  'accountPw',
  'userId', // 나중에 jwt로 받을 예정
  'platformId',
]) {}

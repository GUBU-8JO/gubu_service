import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserSubscriptions } from '../entities/user-subscription.entity';

export class CreateUserSubscriptionDto extends PickType(UserSubscriptions, [
  'startedDate',
  'paymentMethod',
  'period',
  'accountId',
  'accountPw',
  'userId',
  'platformId',
]) {}

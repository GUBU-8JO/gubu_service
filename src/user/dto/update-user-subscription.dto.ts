import { PickType } from '@nestjs/swagger';
import { UserSubscriptions } from '../entities/user-subscription.entity';

export class UpdateUserSubscriptionDto extends PickType(UserSubscriptions, [
  'startedDate',
  'paymentMethod',
  'period',
  'accountId',
  'accountPw',
]) {}

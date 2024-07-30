import { PickType } from '@nestjs/swagger';
import { UserSubscription } from '../entities/user-subscription.entity';

export class CreateUserSubscriptionDto extends PickType(UserSubscription, [
  'startedDate',
  'paymentMethod',
  'period',
  'accountId',
  'accountPw',
]) {}

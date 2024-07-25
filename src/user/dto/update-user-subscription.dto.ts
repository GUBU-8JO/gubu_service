import { UserSubscriptions } from '../entities/user-subscription.entity';
import { PickType } from '@nestjs/swagger';

export class UpdateUserSubscriptionDto extends PickType(UserSubscriptions, [
  'userId',
]) {}

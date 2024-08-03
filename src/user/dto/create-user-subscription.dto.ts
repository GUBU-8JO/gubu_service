import { PickType } from '@nestjs/swagger';
import { UserSubscription } from '../entities/user-subscription.entity';
import { IsNumber, IsString } from 'class-validator';

export class CreateUserSubscriptionDto extends PickType(UserSubscription, [
  'startedDate',
  'paymentMethod',
  'period',
  'accountId',
  'accountPw',
  'price',
]) {
  @IsString()
  startedDate: string;

  @IsString()
  paymentMethod: string;

  @IsNumber()
  period: number;

  @IsString()
  accountId: string;

  @IsString()
  accountPw: string;

  @IsNumber()
  price: number;
}

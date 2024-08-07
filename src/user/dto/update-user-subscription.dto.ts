import { IsOptional } from 'class-validator';

export class UpdateUserSubscriptionDto {
  @IsOptional()
  startedDate: string;

  @IsOptional()
  paymentMethod: string;

  @IsOptional()
  period: number;

  @IsOptional()
  accountId: string;

  @IsOptional()
  accountPw: string;

  @IsOptional()
  price: number;
}

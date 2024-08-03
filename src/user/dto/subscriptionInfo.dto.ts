import { IsString } from 'class-validator';

export class SubscriptionInfoDto {
  @IsString()
  password: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionHistoryDto } from './create-subscription-history.dto';

export class UpdateSubscriptionHistoryDto extends PartialType(CreateSubscriptionHistoryDto) {}

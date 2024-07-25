import { Module } from '@nestjs/common';
import { SubscriptionHistoriesService } from './subscription-histories.service';
import { SubscriptionHistoriesController } from './subscription-histories.controller';

@Module({
  controllers: [SubscriptionHistoriesController],
  providers: [SubscriptionHistoriesService],
})
export class SubscriptionHistoriesModule {}

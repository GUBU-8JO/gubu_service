import { Module } from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { UserSubscriptionsController } from './user-subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscription } from './entities/user-subscription.entity';
import { Platform } from 'src/platform/entities/platforms.entity';
import { SubscriptionHistory } from './entities/subscription-histories.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSubscription,
      Platform,
      SubscriptionHistory,
      User,
    ]),
  ],
  controllers: [UserSubscriptionsController],
  providers: [UserSubscriptionsService],
})
export class UserSubscriptionsModule {}

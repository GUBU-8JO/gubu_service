import { Module } from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { UserSubscriptionsController } from './user-subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriptions } from './entities/user-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSubscriptions])],
  controllers: [UserSubscriptionsController],
  providers: [UserSubscriptionsService],
})
export class UserSubscriptionsModule {}

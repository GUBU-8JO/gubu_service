import { Module } from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { UserSubscriptionsController } from './user-subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriptions } from './entities/user-subscription.entity';
import { Platforms } from 'src/platform/entities/platforms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSubscriptions, Platforms])],
  controllers: [UserSubscriptionsController],
  providers: [UserSubscriptionsService],
})
export class UserSubscriptionsModule {}

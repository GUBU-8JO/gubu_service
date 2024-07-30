import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { SubscriptionHistory } from 'src/user/entities/subscription-histories.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, UserService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserSubscription,
      Notification,
      SubscriptionHistory,
    ]),
  ],
})
export class NotificationsModule {}

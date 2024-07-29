import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { UserService } from 'src/user/user.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { Notification } from './entities/notification.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, UserService],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User, UserSubscription, Notification]),
  ],
})
export class NotificationsModule {}

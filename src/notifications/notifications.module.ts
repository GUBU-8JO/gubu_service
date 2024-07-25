import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { UsersService } from 'src/users/users.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriptions } from 'src/user-subscriptions/entities/user-subscription.entity';
import { Users } from 'src/users/entities/users.entity';
import { Notifications } from './entities/notification.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, UsersService],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Users, UserSubscriptions, Notifications]),
  ],
})
export class NotificationsModule {}

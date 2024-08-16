import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationRepository } from './notification.repository';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository],
  imports: [TypeOrmModule.forFeature([Notification])],
})
export class NotificationsModule {}

import { Controller, Get, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  //jwt로 req.user.id로 받을꺼임
  @Get()
  findAll(@Request() req: number) {
    return { message: '넷플릭스 결제일이 2일 남았습니다' };
  }

  //create, update등등 database알림 저장하는것은 내부 로직으로 구현
}

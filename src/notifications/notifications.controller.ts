import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll() {
    return { message: '넷플릭스 결제일이 2일 남았습니다' };
  }
  //이것만 해도 된다고 했는데,,, 수정? 없어도 되나해서 주석남겨요ㅠㅠ
}

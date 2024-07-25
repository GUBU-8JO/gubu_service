import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  // 테스트 유저 생성
  private user = {
    id: 1,
    email: 'user@user.com',
    nickname: 'user',
  };
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Post()
  // create(@Body() createNotificationDto: CreateNotificationDto) {
  //   return this.notificationsService.create(createNotificationDto);
  // }

  // @Get()
  // findAll() {
  //   return this.notificationsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notificationsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateNotificationDto: UpdateNotificationDto,
  // ) {
  //   return this.notificationsService.update(+id, updateNotificationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notificationsService.remove(+id);
  // }
  //jwt로 req.user.id로 받을꺼임
  @Get()
  findAll(@Request() req: number) {
    return { message: '넷플릭스 결제일이 2일 남았습니다' };
  }

  /**
   * 구독 상세정보 가져오기
   */
  @Get(':notificationId')
  @ApiBearerAuth()
  async GetNotificationById(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Req() req: any,
  ) {
    // const userId = Number(req.user.id);
    const userId = this.user.id; // 테스트 유저 사용으로 로그인 기능 생성 시 삭제
    const notification = await this.notificationsService.findOne(
      userId,
      notificationId,
    );

    return {
      status: HttpStatus.OK,
      message: '알림 상세조회에 성공했습니다.',
      date: notification,
    };
  }

  //create, update등등 database알림 저장하는것은 내부 로직으로 구현
}

import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('알림')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * 알림 목록 조회
   * @Req req
   * @returns
   */
  @Get()
  async GetMyNotifications(@Req() req) {
    const userId = Number(req.user.id);
    console.log('아이디', userId)
    const notifications = await this.notificationsService.findAll(userId);
    console.log(userId);

    return {
      status: HttpStatus.OK,
      message: '알림 목록 조회에 성공했습니다.',
      data: notifications,
    };
  }

  /**
   *  미확인 알림 갯수 조회
   * @Req req
   * @returns
   */
  @Get('count')
  async countNotReadNotifications(@Req() req: any) {
    const userId = Number(req.user.id);
    const notReadNotifications =
      await this.notificationsService.countNotifications(userId);

    return {
      status: HttpStatus.OK,
      message: '미확인 알림 갯수 조회에 성공했습니다.',
      data: notReadNotifications,
    };
  }

  /**
   * 알림 상세정보 가져오기
   * @param notificationId
   * @returns
   */
  @Get(':notificationId')
  async GetNotificationById(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Req() req: any,
  ) {
    const userId = Number(req.user.id);
    const notification = await this.notificationsService.findOne(
      userId,
      notificationId,
    );

    return {
      status: HttpStatus.OK,
      message: '알림 상세조회에 성공했습니다.',
      data: notification,
    };
  }
}

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

@ApiTags('알림')
@Controller('notifications')
export class NotificationsController {
  // 테스트 유저 생성
  private user = {
    id: 1,
    email: 'user@user.com',
    nickname: 'user',
  };
  private user2 = {
    id: 2,
    email: 'user@user.com',
    nickname: 'user',
  };
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * 알림 목록 조회
   * @Req req
   * @returns
   */
  @Get()
  async GetMyNotifications(@Request() req: any) {
    // const userId = Number(req.user.id);
    const userId = this.user.id; // 테스트 유저 사용으로 로그인 기능 생성 시 삭제
    const notifications = await this.notificationsService.findAll(userId);

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
  @ApiBearerAuth()
  async countNotReadNotifications(@Req() req: any) {
    // const userId = Number(req.user.id);
    const userId = this.user2.id; // 테스트 유저 사용으로 로그인 기능 생성 시 삭제
    const notReadNotifications =
      await this.notificationsService.countNotifications(userId);

    return {
      status: HttpStatus.OK,
      message: '미확인 알림 목록 조회에 성공했습니다.',
      data: notReadNotifications,
    };
  }

  /**
   * 알림 상세정보 가져오기
   * @param notificationId
   * @returns
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
      data: notification,
    };
  }
}

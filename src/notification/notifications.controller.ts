import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseDto } from 'src/common/response.dto';
import { NotificationVo } from './dto/notificationVo';
import { CountVo } from './dto/countVo';

@ApiTags('07. 알림')
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
  async GetMyNotifications(@Req() req): Promise<ResponseDto<NotificationVo[]>> {
    const userId = Number(req.user.id);
    return new ResponseDto(await this.notificationsService.findAll(userId));
  }

  /**
   *  미확인 알림 갯수 조회
   * @Req req
   * @returns
   */
  @Get('count')
  async countNotReadNotifications(
    @Req() req: any,
  ): Promise<ResponseDto<CountVo>> {
    const userId = Number(req.user.id);

    return new ResponseDto(
      await this.notificationsService.countNotifications(userId),
    );
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
  ): Promise<ResponseDto<NotificationVo>> {
    const userId = Number(req.user.id);
    return new ResponseDto(
      await this.notificationsService.findOne(userId, notificationId),
    );
  }
}

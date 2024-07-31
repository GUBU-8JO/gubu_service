import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserSubscriptionsContVo } from './dto/user-subscription-responseDto/create-control-subscription-response.dto';
import { ResponseDto } from 'src/common/response.dto';

@ApiTags('05. 유저 구독정보')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('user-subscriptions')
export class UserSubscriptionsController {
  constructor(
    private readonly userSubscriptionsService: UserSubscriptionsService,
  ) {}

  /**
   * 유저구독정보 생성
   * @param req
   * @returns
   */
  @ApiParam({ name: 'platformId', description: '플랫폼 ID', required: true })
  @Post('platform/:platformId')
  async create(
    @Req() req,
    @Param('platformId') platformId: number,
    @Body() createUserSubscriptionDto: CreateUserSubscriptionDto,
  ): Promise<ResponseDto<UserSubscriptionsContVo>> {
    const userId = req.user.id;
    const data = await this.userSubscriptionsService.create(
      createUserSubscriptionDto,
      userId,
      platformId,
    );
    return new ResponseDto(data);
  }

  /**
   * 나의구독정보 조회
   * @param req
   * @returns
   */
  @Get('/me')
  async findAllMe(@Req() req) {
    const userId = req.user.id;
    const data = await this.userSubscriptionsService.findAllMe(userId);
    return {
      status: HttpStatus.OK,
      message: '자기구독정보 조회가 완료되었습니다.',
      data,
    };
  }

  /**
   * 특정 구독정보 조회
   * @returns
   */
  @Get('/:subscriptionId')
  async findOne(@Param('subscriptionId') id: number) {
    const data = await this.userSubscriptionsService.findOne(id);
    return {
      status: HttpStatus.OK,
      message: '특정 구독정보 조회가 완료되었습니다.',
      data,
    };
  }

  /**
   * 유저구독정보 수정
   * @returns
   */
  @Patch(':subscriptionId')
  async update(
    @Param('subscriptionId') id: number,
    @Body() updateUserSubscriptionDto: UpdateUserSubscriptionDto,
  ) {
    const data = await this.userSubscriptionsService.update(
      id,
      updateUserSubscriptionDto,
    );
    return {
      status: HttpStatus.OK,
      message: '정상적으로 수정 완료되었습니다.',
      data,
    };
  }

  /**
   * 유저구독정보 삭제
   * @returns
   */
  @Delete(':subscriptionId')
  async remove(@Param('subscriptionId') id: number) {
    await this.userSubscriptionsService.remove(id);
    return {
      status: HttpStatus.OK,
      message: '정상적으로 삭제되었습니다.',
    };
  }
}

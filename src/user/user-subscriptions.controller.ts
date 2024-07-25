import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('유저구독정보 API')
@Controller('user-subscriptions')
export class UserSubscriptionsController {
  constructor(
    private readonly userSubscriptionsService: UserSubscriptionsService,
  ) {}

  /**
   * 유저구독정보 생성
   * @returns
   */
  @Post('/')
  async create(
    // @Req() req: number,
    @Body() createUserSubscriptionDto: CreateUserSubscriptionDto,
  ) {
    const data = await this.userSubscriptionsService.create(
      createUserSubscriptionDto,
    );
    return {
      status: HttpStatus.CREATED,
      message: '정상적으로 생성이 완료되었습니다.',
      data,
    };
  }

  /**
   * 유저구독 나의정보 조회
   * @returns
   */
  @Get(':userId')
  async findAllMe(
    // @Req() req: number,
    @Param('userId') userId: number,
  ) {
    const data = await this.userSubscriptionsService.findAllMe(userId);
    return {
      status: HttpStatus.CONFLICT,
      message: '정상적으로 생성이 완료되었습니다.',
      data,
    };
  }

  @Get(':subscriptionId')
  findOne(@Param('subscriptionId') id: number) {
    return { message: '선택하신 구독정보가 조회되었습니다.' };
  }

  @Patch(':subscriptionId')
  update(
    @Param('subscriptionId') id: number,
    @Body() updateUserSubscriptionDto: UpdateUserSubscriptionDto,
  ) {
    return { message: '나의 구독정보 수정이 완료되었습니다.' };
  }

  @Delete(':subscriptionId')
  remove(@Param('subscriptionId') id: number) {
    return { message: '나의 구독정보가 삭제되었습니다.' };
  }
}

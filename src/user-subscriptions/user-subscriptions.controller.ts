import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';

@Controller('user-subscriptions')
export class UserSubscriptionsController {
  constructor(private readonly userSubscriptionsService: UserSubscriptionsService) {}
//jwt
  @Post()
  create(@Req() req:number, @Body() createUserSubscriptionDto: CreateUserSubscriptionDto) {
    return {message: "정상적으로 생성이 완료되었습니다."};
  }

  @Get()
  findAllMe(@Req() req:number) {
    return {message: "나의 구독정보가 모두 조회되었습니다."}
  }

  @Get(':subscriptionId' ) 
  findOne(@Param('subscriptionId') id: number) {
    return {message: "선택하신 구독정보가 조회되었습니다."}
  }

  @Patch(':subscriptionId')
  update(@Param('subscriptionId') id: number, @Body() updateUserSubscriptionDto: UpdateUserSubscriptionDto) {
    return {message: "나의 구독정보 수정이 완료되었습니다."}
  }

  @Delete(':subscriptionId')
  remove(@Param('subscriptionId') id: number) {
    return {message: "나의 구독정보가 삭제되었습니다."}
  }
}

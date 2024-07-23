import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionHistoriesService } from './subscription-histories.service';
import { CreateSubscriptionHistoryDto } from './dto/create-subscription-history.dto';
import { UpdateSubscriptionHistoryDto } from './dto/update-subscription-history.dto';

@Controller('subscription-histories')
export class SubscriptionHistoriesController {
  constructor(private readonly subscriptionHistoriesService: SubscriptionHistoriesService) {}

  //내부로직으로 구현할 예정 아마 사용자구독정보를 입력하거나 갱신할 경우 자동으로 로직으로 DB에 저장
  
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionHistoriesService } from './subscription-histories.service';
import { CreateSubscriptionHistoryDto } from './dto/create-subscription-history.dto';
import { UpdateSubscriptionHistoryDto } from './dto/update-subscription-history.dto';

@Controller('subscription-histories')
export class SubscriptionHistoriesController {
  constructor(private readonly subscriptionHistoriesService: SubscriptionHistoriesService) {}

  @Post()
  create(@Body() createSubscriptionHistoryDto: CreateSubscriptionHistoryDto) {
    return this.subscriptionHistoriesService.create(createSubscriptionHistoryDto);
  }

  @Get()
  findAll() {
    return this.subscriptionHistoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionHistoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionHistoryDto: UpdateSubscriptionHistoryDto) {
    return this.subscriptionHistoriesService.update(+id, updateSubscriptionHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionHistoriesService.remove(+id);
  }
}

import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TotalPriceService } from './total-price.service';

@Controller('total')
export class TotalPriceController {
  constructor(private readonly totalPriceService: TotalPriceService) {}

  @Get(':userId/price')
  async getUserMonthlySubscription(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<number> {
    return this.totalPriceService.getUserMonthlySubscription(userId);
  }
}

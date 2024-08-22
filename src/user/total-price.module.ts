import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalPriceService } from './total-price.service';
import { TotalPriceController } from './total-price.controller';
import { SubscriptionHistory } from './entities/subscription-histories.entity';
import { TotalPriceRepository } from './total-price.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionHistory])],
  providers: [ TotalPriceService,TotalPriceRepository],
  controllers: [TotalPriceController],
})
export class TotalPriceModule {}

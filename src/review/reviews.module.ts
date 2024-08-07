import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Platform } from 'src/platform/entities/platforms.entity';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Platform,UserSubscription])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

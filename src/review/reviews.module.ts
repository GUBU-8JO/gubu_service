import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Platform } from 'src/platform/entities/platforms.entity';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import {
  CacheModule as NestCacheModule,
  CacheModuleOptions,
} from '@nestjs/cache-manager';
import { ReviewRepository } from './review.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Platform, UserSubscription]),
    NestCacheModule.register<CacheModuleOptions>({}),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository],
})
export class ReviewsModule {}

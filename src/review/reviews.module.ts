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
import * as redisStore from 'cache-manager-ioredis';
@Module({
  // imports: [
  //   TypeOrmModule.forFeature([Review, Platform, UserSubscription]),
  //   CacheModule(),
  // ],
  imports: [
    TypeOrmModule.forFeature([Review, Platform, UserSubscription]),
    NestCacheModule.register<CacheModuleOptions>({
      store: redisStore,
      host: '',
      port:,
      password: '',
      ttl: 600,
    }),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

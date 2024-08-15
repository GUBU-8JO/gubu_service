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
      host: 'redis-17544.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com',
      port: 17544,
      password: 'xE9kzc66rIPGRmdoiIQ7qTNwpN9eM37k',
      ttl: 600,
    }),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

import { Module } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { PlatformsController } from './platforms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from './entities/platforms.entity';
import {
  CacheModule as NestCacheModule,
  CacheModuleOptions,
} from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([Platform]),
    NestCacheModule.register<CacheModuleOptions>({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: ,
      password: '',
      ttl: 10,
      //600
    }),
  ],
  controllers: [PlatformsController],
  providers: [PlatformsService],
})
export class PlatformsModule {}

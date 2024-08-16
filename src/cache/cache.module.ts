import { Module } from '@nestjs/common';
import {
  CacheModule as NestCacheModule,
  CacheModuleOptions,
} from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    NestCacheModule.registerAsync<CacheModuleOptions>({
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          ttl: configService.get<number>('REDIS_TTL'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [NestCacheModule, CacheService],
  controllers: [CacheController],
  providers: [CacheService],
})
export class CacheModule {}

//controller, service 안쓸 예정

import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheConfig {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setCache(key: string, value: string, ttl: number = 600): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async getCache(key: string): Promise<string | null> {
    return this.cacheManager.get(key);
  }

  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
  //   private cacheManager: cacheManager.Cache;
  //     private redisClient: Redis.Redis;

  //     constructor() {
  //         this.redisClient = new Redis({
  //             host: 'redis-17544.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com',
  //       port: 17544,
  //       password: 'xE9kzc66rIPGRmdoiIQ7qTNwpN9eM37k',
  //       db: 0,
  //         })
  //     }
}

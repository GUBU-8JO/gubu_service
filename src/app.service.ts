import { InjectRedis } from '@nestjs-modules/ioredis';
import { Get, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private configService: ConfigService,
  ) {}
  @Get()
  async getHello() {
    await this.redis.set('naji', 'Redis data!');
    const redisData = await this.redis.get('naji');
    return redisData;
  }
}

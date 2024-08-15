import { Module } from '@nestjs/common';
import { PlatformsController } from './platforms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from './entities/platforms.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlatformRepository } from './platforms.repository';
import { PlatformService } from './platforms.service';

// import { Redis } from 'ioredis';
// // import Redis from 'ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([Platform]),
    RedisModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      //[ConfigService]
      useFactory: async (configService: ConfigService) => {
        const url = `redis://:${configService.get('REDIS_PASSWORD')}@${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}/0`;
        return {
          type: 'single',
          url,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [PlatformsController],
  //플랫폼 서비스 -> 플랫폼 레파지토리
  providers: [PlatformService, PlatformRepository],
  //생성
  exports: [PlatformRepository],
})
export class PlatformsModule {}

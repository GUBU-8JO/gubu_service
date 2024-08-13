import { Module } from '@nestjs/common';
import {
  //NestCacheModule 로. 이름 바꿔주기
  CacheModule as NestCacheModule,
  CacheModuleOptions,
} from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-ioredis';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';

@Module({
  imports: [
    //캐시모듈 세팅 : 저장소(host, port 등) : 캐시 저장소로 레디스 사용
    //NestCacheModule 이용해서 등록(@nestjs/cache-manager) &&
    //캐시모듈 사용하기 위해서 레디스 호스트, 포트번호 등 세팅함
    NestCacheModule.register<CacheModuleOptions>({
      // store: redisStore,
      host: '', // Redis 호스트
      port: , // Redis 포트
      password: '', // Redis 비밀번호
      ttl: 600, // 캐시 유지 시간(초)
    }),
  ],
  exports: [NestCacheModule],
  controllers: [CacheController],
  providers: [CacheService],
})
export class CacheModule {}
//실제로 레디스 설치 후 연결할때 필요한 로직

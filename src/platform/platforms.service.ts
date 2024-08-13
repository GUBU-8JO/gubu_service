import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Platform } from './entities/platforms.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformVo } from './dto/platformVo';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { redis } from 'src/redis/redis';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platform)
    private platformRepositoty: Repository<Platform>,
    //캐시 모듈 세팅 후 캐시매니저 가져오기 : 공식문서
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  //
  @Cron(CronExpression.EVERY_10_SECONDS)
  async findAllPlatforms(): Promise<PlatformVo[]> {
    console.time('findAllPlatforms');

    const cacheKey = 'allPlatforms';
    const cachedAllPlatforms =
      await this.cacheManager.get<PlatformVo[]>(cacheKey);
    if (cachedAllPlatforms) {
      console.timeEnd('findAllPlatforms');
      console.log('전체조회--', cachedAllPlatforms);
      return cachedAllPlatforms;
    }

    const platforms = await this.platformRepositoty.find({
      select: [
        'id',
        'title',
        'price',
        'rating',
        'image',
        'categoryId',
        'purchaseLink',
        'period',
      ],
      order: { id: 'ASC' },
      take: 10,
    });
    const result = platforms.map(
      (platform) =>
        new PlatformVo(
          platform.id,
          platform.title,
          platform.price,
          platform.rating,
          platform.image,
          platform.categoryId,
          platform.purchaseLink,
          platform.period,
        ),
    );
    await this.cacheManager.set(cacheKey, result, 600); //68400
    // redis.set('findAllPlatforms', JSON.stringify(result));
    // redis.get('findAllPlatforms', (err, result) => {
    //   if (err) {
    //     console.error(err);
    //     return result;
    //   } else {
    //     console.log(JSON.parse(result));
    //   }
    // });
    console.timeEnd('findAllPlatforms');
    console.log(result);
    return result;
  }
  @Cron(CronExpression.EVERY_10_SECONDS)
  async getTopRatedPlatforms(): Promise<PlatformVo[]> {
    console.time('getTopRatedPlatforms');

    const cacheKey = 'top_rated_platforms';
    const cachedPlatforms = await this.cacheManager.get<PlatformVo[]>(cacheKey);
    if (cachedPlatforms) {
      console.timeEnd('getTopRatedPlatforms');
      console.log(cachedPlatforms);
      return cachedPlatforms;
    }

    const platforms = await this.platformRepositoty.find({
      select: ['id', 'title', 'price', 'rating', 'image'],
      order: { rating: 'DESC' },
      take: 5,
    });
    const result = platforms.map(
      (platform) =>
        new PlatformVo(
          platform.id,
          platform.title,
          platform.price,
          platform.rating,
          platform.image,
        ),
    );
    //get이 있으면 가져오고, 없음 디비에서 가져옴
    await this.cacheManager.set(cacheKey, result, 600); // 1시간 동안 캐시 유지해야함 86400
    redis.set('getTopRatedPlatforms', JSON.stringify(result));
    redis.get('getTopRatedPlatforms', (err, result) => {
      //레디스가 getTopRatedPlatforms가 없을 때
      if (err) {
        console.error(err);
        return result;
        //레디스에 값이 있을 때
      } else {
        console.log(JSON.parse(result)); // Prints "value"
      }
    });
    console.timeEnd('getTopRatedPlatforms');
    console.log(result); // 10초마다 결과를 콘솔에 출력
    return result;
  }

  async findOnePlatformById(id: number): Promise<PlatformVo> {
    const platform = await this.platformRepositoty.findOne({
      where: { id },
      select: [
        'id',
        'title',
        'price',
        'rating',
        'image',
        'categoryId',
        'purchaseLink',
        'period',
      ],
    });
    if (!platform) {
      throw new NotFoundException({
        message: '해당 플랫폼이 존재하지 않습니다.',
      });
    }
    return new PlatformVo(
      platform.id,
      platform.title,
      platform.price,
      platform.rating,
      platform.image,
      platform.categoryId,
      platform.purchaseLink,
      platform.period,
    );
  }
}

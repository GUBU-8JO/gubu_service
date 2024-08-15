import { PlatformVo } from './dto/platformVo';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { PlatformRepository } from './platforms.repository';
import { Inject } from '@nestjs/common';

//@Injectable() : 디비 건드리는 친구에게 붙이는 것
export class PlatformService {
  //레파지토리와 연결
  constructor(
    @Inject(PlatformRepository)
    private readonly platformRepository: PlatformRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  //우리는 : 레디스 관련은 여기
  async findAllPlatforms(): Promise<PlatformVo[]> {
    console.time('findAllPlatforms');

    const cacheKey = 'allPlatforms';
    const cachedAllPlatforms = await this.redis.get(cacheKey);
    if (cachedAllPlatforms) {
      console.timeEnd('findAllPlatforms');
      console.log('전체조회--', JSON.parse(cachedAllPlatforms)); // JSON 파싱
      return JSON.parse(cachedAllPlatforms);
    }
    const platforms = await this.platformRepository.findAllPlatforms();
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
    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 600); //68400

    console.timeEnd('findAllPlatforms');
    console.log(result);
    return result;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async getTopRatedPlatforms(): Promise<PlatformVo[]> {
    await this.redis.del('top_rated_platforms');
    console.time('getTopRatedPlatforms');
    //데이터 가져오기
    const cacheKey = 'top_rated_platforms';
    const cachedPlatforms = await this.redis.zrevrange(
      cacheKey,
      0,
      10,
      'WITHSCORES',
    );
    if (cachedPlatforms.length > 0) {
      console.timeEnd('getTopRatedPlatforms');
      const parsedCachedPlatforms = JSON.parse(cachedPlatforms[0]);
      console.log(parsedCachedPlatforms);
      return parsedCachedPlatforms;
    }

    const platforms = await this.platformRepository.findAllPlatforms();
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
    //get이 있으면 가져오고, 없음 디비에서 가져옴.
    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 600); // 1시간 동안 캐시 유지해야함 86400
    //
    // await this.redis.zadd('');

    console.timeEnd('getTopRatedPlatforms');
    console.log(result); // 10초마다 결과를 콘솔에 출력
    return result;
  }

  async findOnePlatformById(id: number): Promise<PlatformVo> {
    const platform = await this.platformRepository.findOnePlatformById(id);
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

///
//   @Cron('0 0 9 * * *',{ timeZone : 'Asia/seoul'})
//   async todayrank()=> {
//   // 디비수식
//     const platforms = await this.platformRepositoty.find({
//       select: ['id', 'title', 'price', 'rating', 'image'],
//       order: { rating: 'DESC' },
//       take: 5,
//     });
// }
// this.redis.set({
//   'rank', platforms
//     return this.redis.get('rank')
// }
// )

///

import { Injectable, NotFoundException } from '@nestjs/common';
import { Platform } from './entities/platforms.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformVo } from './dto/platformVo';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platform)
    private platformRepositoty: Repository<Platform>,

    private readonly cacheService: CacheService,
  ) {}

  async findAllPlatforms(): Promise<PlatformVo[]> {
    const cachekey = 'platforms';
    const platformList = await this.cacheService.getCache(cachekey);
    const platforms = platformList
      ? JSON.parse(platformList)
      : await this.platformRepositoty.find({
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

    if (!platformList && platforms.length > 0) {
      await this.cacheService.setCache(cachekey, platforms, {
        ttl: 3600,
      } as any);
    }

    return platforms.map(
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
  }

  async getTopRatedPlatforms(): Promise<PlatformVo[]> {
    const cachekey = 'topPlatforms';
    const topPlatforms = await this.cacheService.getCache(cachekey);
    const platforms = topPlatforms
      ? JSON.parse(topPlatforms)
      : await this.platformRepositoty.find({
          select: ['id', 'title', 'price', 'rating', 'image'],
          order: { rating: 'DESC' },
          take: 10,
        });

    if (!topPlatforms && platforms.length > 0) {
      await this.cacheService.setCache(cachekey, platforms, {
        ttl: 3600,
      } as any);
    }

    return platforms.map(
      (platform) =>
        new PlatformVo(
          platform.id,
          platform.title,
          platform.price,
          platform.rating,
          platform.image,
        ),
    );
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

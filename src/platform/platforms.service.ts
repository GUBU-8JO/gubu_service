import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Platform } from './entities/platforms.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformVo } from './dto/platformVo';
import { CacheService } from 'src/cache/cache.service';
import { cache } from 'joi';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platform)
    private platformRepositoty: Repository<Platform>,

    private readonly cacheService: CacheService,
  ) {}

  async findAllPlatforms(): Promise<PlatformVo[]> {
    const cachekey = 'platforms';
    const data = await this.cacheService.getCache(cachekey);
    const jsonData = JSON.parse(data);

    if (!jsonData) {
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
      });
      if (!platforms) {
        throw new NotFoundException({
          message: '해당 플랫폼이 존재하지 않습니다.',
        });
      }

      await this.cacheService.setCache(cachekey, platforms, {
        ttl: 3600,
      } as any);

      const data = await this.cacheService.getCache(cachekey);
      const jsonData = JSON.parse(data);

      return jsonData.map(
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

    return jsonData.map(
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
    const cachekey = 'platformRating';
    const data = await this.cacheService.getCache(cachekey);

    const jsonData = JSON.parse(data);

    if (!data) {
      const platforms = await this.platformRepositoty.find({
        select: ['id', 'title', 'price', 'rating', 'image'],
        order: { rating: 'DESC' },
        take: 10,
      });
      if (!platforms) {
        throw new NotFoundException({
          message: '해당 플랫폼이 존재하지 않습니다.',
        });
      }
      await this.cacheService.setCache(cachekey, platforms, {
        ttl: 3600,
      } as any);
      const data = await this.cacheService.getCache(cachekey);

      const jsonData = JSON.parse(data);

      return jsonData.map(
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

    return jsonData.map(
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { PlatformVo } from './dto/platformVo';
import { CacheService } from 'src/cache/cache.service';
import { PlatformRepository } from './platforms.repository';
@Injectable()
export class PlatformsService {
  constructor(
    private readonly platformRepository: PlatformRepository,
    private readonly cacheService: CacheService,
  ) {}
  async findAllPlatforms(sortId: string): Promise<PlatformVo[]> {
    const cachekey = 'platforms';
    const platformList = await this.cacheService.getCache(cachekey);
    const platforms = platformList
      ? JSON.parse(platformList)
      : await this.platformRepository.findPlatforms();
    if (!platformList && platforms.length > 0) {
      await this.cacheService.setCache(cachekey, JSON.stringify(platforms), {
        ttl: 3600,
      } as any);
    }

    const sortPlatforms = await this.sortPlatformsBySortId(platforms, sortId);

    return sortPlatforms.map(
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
      : await this.platformRepository.findTopPlatforms();
    if (!topPlatforms && platforms.length > 0) {
      await this.cacheService.setCache(cachekey, JSON.stringify(platforms), {
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
    const platform = await this.platformRepository.platformById(id);
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

  private sortPlatformsBySortId(data: any[], sortId: string): any[] {
    switch (sortId) {
      case 'title':
        return data.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return data.sort((a, b) => b.rating - a.rating);
      default:
        return data;
    }
  }
}

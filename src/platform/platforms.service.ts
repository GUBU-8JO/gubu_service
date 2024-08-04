import { Injectable, NotFoundException } from '@nestjs/common';
import { Platform } from './entities/platforms.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformVo } from './dto/platformVo';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platform)
    private platformRepositoty: Repository<Platform>,
  ) {}

  async findAllPlatforms(): Promise<PlatformVo[]> {
    const platforms = await this.platformRepositoty.find({
      select: ['id', 'title', 'price', 'rating', 'image'],
    });
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

  async getTopRatedPlatforms(): Promise<PlatformVo[]> {
    const platforms = await this.platformRepositoty.find({
      select: ['id', 'title', 'price', 'rating', 'image'],
      order: { rating: 'DESC' },
      take: 5,
    });
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
      select: ['id', 'title', 'price', 'rating', 'image'],
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
    );
  }
}

// 레이팅으로 order 하고, skip 0 부터 take 4 까지 하면될듯?

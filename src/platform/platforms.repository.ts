import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Platform } from './entities/platforms.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlatformRepository {
  constructor(
    @InjectRepository(Platform)
    private readonly repository: Repository<Platform>,
  ) {}
  async findPlatforms(): Promise<Platform[]> {
    const platforms = await this.repository.find({
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
    return platforms;
  }

  async platformById(id: number): Promise<Platform> {
    const platform = await this.repository.findOne({
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

    return platform;
  }

  async findTopPlatforms(): Promise<Platform[]> {
    const topPlatforms = await this.repository.find({
      select: ['id', 'title', 'price', 'rating', 'image'],
      order: { rating: 'DESC' },
      take: 10,
    });
    return topPlatforms;
  }
}

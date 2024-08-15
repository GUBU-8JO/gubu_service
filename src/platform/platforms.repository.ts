import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Platform } from './entities/platforms.entity';

@Injectable()
export class PlatformRepository extends Repository<Platform> {
  async findPlatforms(): Promise<Platform[]> {
    const platforms = await this.find({
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
    const platform = await this.findOne({
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
}

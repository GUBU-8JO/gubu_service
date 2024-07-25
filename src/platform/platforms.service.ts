import { Injectable, NotFoundException } from '@nestjs/common';
import { Platforms } from './entities/platforms.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platforms)
    private platformRepositoty: Repository<Platforms>,
  ) {}

  async findById(id: number): Promise<Platforms> {
    const platform = await this.platformRepositoty.findOne({
      where: { id },
      select: ['id', 'title', 'price'],
    });
    if (!platform) {
      throw new NotFoundException({
        message: '해당 플랫폼이 존재하지 않습니다.',
      });
    }
    return platform;
  }

  async findMany() {
    return await this.platformRepositoty.find({
      select: ['id', 'title', 'price'],
    });
  }
}

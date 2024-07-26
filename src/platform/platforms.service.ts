import { Injectable, NotFoundException } from '@nestjs/common';
import { Platforms } from './entities/platforms.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {PlatformVo} from "./dto/PlatformVo";

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platforms)
    private platformRepositoty: Repository<Platforms>,
  ) {}

  async findById(id: number): Promise<PlatformVo> {
    const platform = await this.platformRepositoty.findOne({
      where: { id },
      select: ['id', 'title', 'price'],
    });
    if (!platform) {
      throw new NotFoundException({
        message: '해당 플랫폼이 존재하지 않습니다.',
      });
    }
    return new PlatformVo(platform.id, platform.title, platform.price, "this is comment test")
  }

  async findMany(): Promise<PlatformVo[]> {
    const platforms = await this.platformRepositoty.find({
      select: ['id', 'title', 'price'],
    })
    return platforms.map(platform =>
        new PlatformVo(platform.id, platform.title, platform.price))
  }
}

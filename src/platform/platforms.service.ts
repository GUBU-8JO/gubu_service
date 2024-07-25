import { Injectable } from '@nestjs/common';
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
    return await this.platformRepositoty.findOne({
      where: { id },
      select: ['id', 'title', 'price'],
    });
  }

  async findMany() {
    return await this.platformRepositoty.find({
      select: ['id', 'title', 'price'],
    });
  }
}

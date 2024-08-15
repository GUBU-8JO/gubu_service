//예시
//1. app.module.ts에 타입모듈 지정, 엔티티 생성,
//2 커스텀 레포지토리 생성(nest g service user)
//3. 레파지토리 .ts 파일생성
//데이터 베이스 굳이 안가져와도 됨 : 10번줄 삭제
import { Repository } from 'typeorm';
import { Platform } from './entities/platforms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PlatformVo } from './dto/platformVo';

// 우리는 데이터베이스 관련은 여기
@Injectable()
export class PlatformRepository {
  private repository;

  constructor(
    //엔티티(엔티티:디비안에 속해있음) 가져와야함.
    @InjectRepository(Platform)
    private platformRepository: Repository<Platform>,
  ) {}
  @Cron(CronExpression.EVERY_10_SECONDS)
  async findAllPlatforms(): Promise<PlatformVo[]> {
    const platforms = await this.platformRepository.find({
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
      order: { id: 'ASC' },
      take: 10,
    });
    return platforms;
  }

  async getTopRatedPlatforms(): Promise<PlatformVo[]> {
    const platforms = await this.platformRepository.find({
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
      order: { rating: 'DESC' },
      take: 5,
    });
    return platforms;
  }

  async findOnePlatformById(id: number): Promise<PlatformVo> {
    const platform = await this.platformRepository.findOne({
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
    return platform;
  }
}

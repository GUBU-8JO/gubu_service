import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Platform } from 'src/platform/entities/platforms.entity';
import _ from 'lodash';
import { ReadAllReviewVo } from './dto/vo/readAll-review-vo.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
  ) {}

  async create(
    userId: number,
    platformId: number,
    { rate, comment }: CreateReviewDto,
  ) {
    const existPlatform = this.platformRepository.findOne({
      where: { id: platformId },
    });

    if (_.isNil(existPlatform)) throw new NotFoundException();

    const review = this.reviewsRepository.save({
      userId,
      platformId,
      rate,
      comment,
    });

    return review;
  }

  async findAll(platformId: number): Promise<ReadAllReviewVo[]> {
    console.log('platformId' + platformId);
    const data = await this.reviewsRepository.find({
      where: { platformId },
      select: ['platformId', 'rate', 'comment'],
    });

    return data;
  }
}

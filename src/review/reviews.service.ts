import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Platform } from 'src/platform/entities/platforms.entity';
import _ from 'lodash';
import { ReadReviewVo } from './dto/vo/read-review-vo.dto';
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
    const existPlatform = await this.platformRepository.findOne({
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

  async findMyReview(userId): Promise<ReadReviewVo[]> {
    const review = await this.reviewsRepository.find({
      where: { userId },
      select: ['id', 'rate', 'comment'],
    });

    return review;
  }

  async findPlatformReview(platformId: number): Promise<ReadAllReviewVo[]> {
    const data = await this.reviewsRepository.find({
      where: { platformId },
      select: ['id', 'rate', 'comment'],
    });
    if (!data.length)
      throw new NotFoundException('해당 플랫폼에 리뷰가 존재하지 않습니다.');
    return data;
  }
}

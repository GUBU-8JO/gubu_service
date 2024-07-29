import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Platform } from 'src/platform/entities/platforms.entity';
import _ from 'lodash';

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

  async delete(id: number) {
    await this.reviewsRepository.delete({ id });

    const data = await this.reviewsRepository.findOne({ where: { id } });

    if (_.isNil(data)) {
      return true;
    } else {
      throw new BadRequestException('삭제가 이루어지지 않았습니다.');
    }
  }
}

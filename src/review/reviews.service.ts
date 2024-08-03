import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Platform } from 'src/platform/entities/platforms.entity';
import _ from 'lodash';
import { ReadReviewVo } from './dto/vo/read-review-vo.dto';
import { ReadAllReviewVo } from './dto/vo/readAll-review-vo';
import { CreateReviewVo } from './dto/vo/create-review-vo';

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
  ): Promise<CreateReviewVo> {
    const existPlatform = await this.platformRepository.findOne({
      where: { id: platformId },
    });
    if (_.isNil(existPlatform)) throw new NotFoundException();
    const existReview = await this.reviewsRepository.findOne({
      where: { userId, platformId },
    });
    if (existReview) {
      throw new ConflictException({
        message: '리뷰는 하나만 작성할 수 있습니다.',
      });
    }
    const review = await this.reviewsRepository.save({
      userId,
      platformId,
      rate,
      comment,
    });

    return new CreateReviewVo(review.id, review.rate, review.comment);
  }

  async findMyReview(userId: number): Promise<ReadReviewVo[]> {
    const review = await this.reviewsRepository.find({
      where: { userId },
      relations: ['user'],
      select: ['id', 'rate', 'comment', 'user', 'platformId'],
    });

    return review.map(
      (review) =>
        new ReadReviewVo(
          review.id,
          review.platformId,
          review.comment,
          review.rate,
          review.user.nickname,
        ),
    );
  }

  async findPlatformReview(platformId: number): Promise<ReadAllReviewVo[]> {
    const data = await this.reviewsRepository.find({
      where: { platformId },
      relations: ['user'],
      select: ['id', 'rate', 'comment', 'user', 'platformId'],
    });
    if (!data.length)
      throw new NotFoundException('해당 플랫폼에 리뷰가 존재하지 않습니다.');

    return data.map(
      (review) =>
        new ReadAllReviewVo(
          review.id,
          review.platformId,
          review.comment,
          review.rate,
          review.user.nickname,
        ),
    );
  }
  // createAt 기준으로 내림차순으로 최신순 > 구형순

  async deleteReview(id: number) {
    const existData = await this.reviewsRepository.findOne({ where: { id } });
    if (_.isNil(existData))
      throw new NotFoundException('존재하는 데이터가 없습니다.');

    await this.reviewsRepository.delete({ id });

    const data = await this.reviewsRepository.findOne({ where: { id } });

    if (_.isNil(data)) {
      return true;
    } else {
      throw new BadRequestException('삭제가 이루어지지 않았습니다.');
    }
  }
}

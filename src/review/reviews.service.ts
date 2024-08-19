import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReadReviewVo } from './dto/vo/read-review-vo.dto';
import { ReadAllReviewVo } from './dto/vo/readAll-review-vo';
import { CreateReviewVo } from './dto/vo/create-review-vo';
import { ReviewRepository } from './review.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from 'src/platform/entities/platforms.entity';
import { Repository } from 'typeorm';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
  ) {}

  async create(
    userId: number,
    platformId: number,
    { rate, comment }: CreateReviewDto,
  ): Promise<CreateReviewVo> {
    const existPlatform = await this.platformRepository.findOne({
      where: { id: platformId },
    });
    if (!existPlatform)
      throw new NotFoundException('플랫폼이 존재하지 않습니다.');

    const userSubscription = await this.userSubscriptionRepository.findOne({
      where: { userId, platformId },
    });
    if (!userSubscription) {
      throw new ForbiddenException(
        '구독한 플랫폼에만 리뷰를 작성할 수 있습니다.',
      );
    }

    const existReview = await this.reviewRepository.findReview(
      userId,
      platformId,
    );
    if (existReview) {
      throw new ConflictException('리뷰는 하나만 작성할 수 있습니다.');
    }

    const review = await this.reviewRepository.create({
      userId,
      platformId,
      rate,
      comment,
    });

    return new CreateReviewVo(review.id, review.rate, review.comment);
  }

  async findMyReview(userId: number): Promise<ReadReviewVo[]> {
    const reviews = await this.reviewRepository.findByUserId(userId);

    return reviews.map(
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
    const reviews = await this.reviewRepository.findByPlatformId(platformId);

    if (reviews.length === 0) {
      throw new NotFoundException('해당 플랫폼에 리뷰가 존재하지 않습니다.');
    }

    return reviews.map(
      (review) =>
        new ReadAllReviewVo(
          review.id,
          review.platformId,
          review.comment,
          review.rate,
          review.user.nickname,
          review.createdAt,
        ),
    );
  }

  async deleteReview(id: number) {
    const existReview = await this.reviewRepository.findReviewById(id);
    if (!existReview) {
      throw new NotFoundException('존재하는 리뷰가 없습니다.');
    }

    await this.reviewRepository.deleteReviewById(id);

    const deletedReview = await this.reviewRepository.findReviewById(id);
    if (!deletedReview) {
      return true;
    } else {
      throw new BadRequestException('리뷰 삭제에 실패했습니다.');
    }
  }
}

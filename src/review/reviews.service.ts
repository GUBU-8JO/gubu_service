import { Injectable } from '@nestjs/common';
import { Reviews } from './entities/review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
  ) {}

  async create(
    userId: number,
    platformId: number,
    { rate, comment }: CreateReviewDto,
  ) {
    const review = this.reviewsRepository.save({
      userId,
      platformId,
      rate,
      comment,
    });

    return review;
  }
}

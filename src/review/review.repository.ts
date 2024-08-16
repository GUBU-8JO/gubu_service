import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
  ) {}

  async findByUserId(userId: number) {
    return this.repository.find({
      where: { userId },
      relations: ['user'],
      select: ['id', 'rate', 'comment', 'user', 'platformId'],
    });
  }

  async findByPlatformId(platformId: number) {
    return this.repository.find({
      where: { platformId },
      relations: ['user'],
      select: ['id', 'rate', 'comment', 'user', 'platformId', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findReview(userId: number, platformId: number) {
    return this.repository.findOne({
      where: { userId, platformId },
    });
  }

  async findReviewById(id: number) {
    return this.repository.findOne({
      where: { id },
    });
  }

  async create(review: Partial<Review>) {
    return this.repository.save(this.repository.create(review));
  }

  async deleteReviewById(id: number) {
    return this.repository.delete({ id });
  }
}

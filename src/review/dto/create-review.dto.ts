import { PickType } from '@nestjs/swagger';
import { Review } from '../entities/review.entity';

export class CreateReviewDto extends PickType(Review, ['rate', 'comment']) {}

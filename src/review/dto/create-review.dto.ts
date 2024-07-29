import { PickType } from '@nestjs/swagger';
import { Reviews } from '../entities/review.entity';

export class CreateReviewDto extends PickType(Reviews, ['rate', 'comment']) {}

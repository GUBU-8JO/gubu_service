import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindReviewDto {
  @IsNumber()
  @IsNotEmpty()
  platformId: number;
}

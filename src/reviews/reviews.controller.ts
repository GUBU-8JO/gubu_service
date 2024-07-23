import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':serviceId')
  create(@Param('serviceId') @Body() createReviewDto: CreateReviewDto) {
    return { message: '리뷰를 성공적으로 등록했습니다.' };
  }

  @Get(':serviceId')
  findAll(@Param(':serviceId') serviceId: number, @Body('id') id: number) {
    return { message: '리뷰를 성공적으로 조회했습니다.' };
  }

  @Get(':servicedId')
  findOne(@Param(':serviceId') serviceId: string, @Body('id') id: number) {
    return this.reviewsService.findOne(+id);
  }

  @Delete(':servicedId')
  remove(@Param(':serviceId') serviceId: string, @Body('id') id: number) {
    return this.reviewsService.remove(+id);
  }
}

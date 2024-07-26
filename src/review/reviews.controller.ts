import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Req,
  Param,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewDto } from './dto/find-review.dto';

@Controller('reviwes')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  //jwt로 req.user.id 받아올꺼임
  @Post()
  create(@Req() req: number, @Body() createReviewDto: CreateReviewDto) {
    return { message: '리뷰를 성공적으로 등록했습니다.' };
  }

  @Get()
  findMe(@Req() req: number, @Body('serviceId') findReviewDto: FindReviewDto) {
    return { message: '리뷰를 성공적으로 조회했습니다.' };
  }

  @Get()
  findAll(@Body('serviceId') findReviewDto: FindReviewDto) {
    return { message: '리뷰를 성공적으로 조회했습니다.' };
  }

  @Delete(':reviewId')
  remove(@Param() id: number) {
    return { message: '리뷰를 성공적으로 삭제하였습니다.' };
  }
}

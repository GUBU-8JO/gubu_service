import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Req,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseDto } from 'src/common/response.dto';
import { CreateReviewVo } from './dto/vo/create-review-vo';
import { ReadReviewVo } from './dto/vo/read-review-vo.dto';
import { ReadAllReviewVo } from './dto/vo/readAll-review-vo';
import _ from 'lodash';

@ApiTags('06. 리뷰')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  /**
   * 리뷰등록
   * @param req
   * @param platformId 
   * @param createReviewDto 
   * @returns
   */
  @Post('platform/:platformId')
  async create(
    @Req() req,
    @Param('platformId') platformId: number,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ResponseDto<CreateReviewVo>> {
    const userId = req.user.id;
    const createdReview = await this.reviewsService.create(
      userId,
      platformId,
      createReviewDto,
    );
    return new ResponseDto(createdReview);
  }

  /**
   * 나의리뷰조회
   * @param req 
   * @returns
   */
  @Get('/me')
  async findMyReview(@Req() req): Promise<ResponseDto<ReadReviewVo[]>> {
    const userId = req.user.id;
    const myReviews = await this.reviewsService.findMyReview(userId);

    if (_.isNil(myReviews)) throw new NotFoundException('작성하신 리뷰가 없습니다.');

    return new ResponseDto(myReviews);
  }

  /**
   * 플랫폼 리뷰 전체 조회
   * @param platformId
   * @returns
   */
  @Get('platform/:platformId')
  async findPlatformReview(
    @Param('platformId') platformId: number,
  ): Promise<ResponseDto<ReadAllReviewVo[]>> {
    const platformReviews = await this.reviewsService.findPlatformReview(platformId);
    return new ResponseDto(platformReviews);
  }

  /**
   * 리뷰삭제
   * @param reviewId
   * @returns
   */
  @Delete(':reviewId')
  async deleteReview(@Param('reviewId') id: number) {
   await this.reviewsService.deleteReview(id);

    return { message: '리뷰를 성공적으로 삭제하였습니다.' };
  }
}

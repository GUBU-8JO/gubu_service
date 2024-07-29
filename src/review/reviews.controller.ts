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
import { FindReviewDto } from './dto/find-review.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseDto } from 'src/common/response.dto';
import { CreateReviewVo } from './dto/vo/create-review-vo.dto';
import { ReadReviewVo } from './dto/vo/read-review-vo.dto';
import _ from 'lodash';
import { ReadAllReviewVo } from './dto/vo/readAll-review-vo.dto';

@ApiTags('리뷰')
@Controller('reviwes')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  /**
   * 리뷰등록
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('platform/:platformId')
  async create(
    @Req() req,
    @Param('platformId') platformId: number,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ResponseDto<CreateReviewVo>> {
    const userId = req.user.id;
    console.log(userId);
    const data = await this.reviewsService.create(
      userId,
      platformId,
      createReviewDto,
    );
    return new ResponseDto(data);
  }

  /**
   * 나의리뷰조회
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findMyReview(@Req() req): Promise<ResponseDto<ReadReviewVo[]>> {
    const userId = req.user.id;
    const data = await this.reviewsService.findMyReview(userId);

    if (_.isNil(data)) throw new NotFoundException('작성하신 리뷰가 없습니다.');

    return new ResponseDto(data);
  }

  /**
   * 플랫폼 리뷰 전체 조회
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('platform/:platformId')
  async findPlatformReview(
    @Param('platformId') platformId: number,
  ): Promise<ResponseDto<ReadAllReviewVo[]>> {
    const data = await this.reviewsService.findPlatformReview(platformId);
    return new ResponseDto(data);
  }

  @Delete(':reviewId')
  remove(@Param() id: number) {
    return { message: '리뷰를 성공적으로 삭제하였습니다.' };
  }
}

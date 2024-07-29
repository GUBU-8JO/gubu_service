import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewDto } from './dto/find-review.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseDto } from 'src/common/response.dto';
import { CreateReviewVo } from './dto/vo/create-reivew-vo.dto';
import { ReadAllReviewVo } from './dto/vo/readAll-review-vo.dto';

@ApiTags('review')
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
  @Post('platformId/:platformId')
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

  @Get('/me')
  findMe(@Req() req: number, @Body('serviceId') findReviewDto: FindReviewDto) {
    return { message: '리뷰를 성공적으로 조회했습니다.' };
  }

  /**
   * 플랫폿 리뷰 전체 조회
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('platformId/:platformId')
  async findAll(
    @Param('platformId') platformId: number,
  ): Promise<ResponseDto<ReadAllReviewVo[]>> {
    const data = await this.reviewsService.findAll(platformId);
    return new ResponseDto(data);
  }

  @Delete(':reviewId')
  remove(@Param() id: number) {
    return { message: '리뷰를 성공적으로 삭제하였습니다.' };
  }
}

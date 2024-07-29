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
import { CreateReviewDtoVo } from './dto/vo/create-reivew-vo.dto';

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
  ): Promise<ResponseDto<CreateReviewDtoVo>> {
    const userId = req.user.id;
    const data = await this.reviewsService.create(
      userId,
      platformId,
      createReviewDto,
    );
    return new ResponseDto(data);
  }

  @Get()
  findMe(@Req() req: number, @Body('serviceId') findReviewDto: FindReviewDto) {
    return { message: '리뷰를 성공적으로 조회했습니다.' };
  }

  @Get()
  findAll(@Body('serviceId') findReviewDto: FindReviewDto) {
    return { message: '리뷰를 성공적으로 조회했습니다.' };
  }

  /**
   * 리뷰삭제
   * @param req
   * @returns
   */
  @Delete(':reviewId')
  remove(@Param('reviewId') id: number) {
    const data = this.reviewsService.delete(id);

    return { message: '리뷰를 성공적으로 삭제하였습니다.' };
  }
}

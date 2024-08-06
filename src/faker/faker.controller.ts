import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FakerService } from './faker.service';
import { ResponseDto } from 'src/common/response.dto';

@ApiTags('08. 페이커')
@Controller('faker')
export class FakerController {
  constructor(private readonly fakerService: FakerService) {}

  /**
   * 페이크 유저 생성
   *
   *
   */
  @Get('generate-Ten-fake-user')
  @ApiQuery({
    name: 'count',
    required: false,
    description: '생성할 유저의 개수',
    type: String,
  })
  async generateTenFakeUser(@Query('count') count?: string) {
    const fakeUserCount = parseInt(count, 10) || 1;
    const fakeUsers = await this.fakerService.generateFakeUsers(fakeUserCount);
    return new ResponseDto(
      fakeUsers,
      null,
      `${fakeUserCount}개의 페이크 유저 생성에 성공했습니다.`,
    );
  }

  /**
   * 페이크 구독 생성
   *
   *
   */
  @Get('/fakeSubscription')
  @ApiQuery({
    name: 'count',
    required: false,
    description: '생성할 구독의 개수',
    type: String,
  })
  async generateFakeSubscription(@Query('count') count?: string) {
    const fakeSubscriptionCount = parseInt(count, 10) || 1;
    const fakeSubscription = await this.fakerService.generateFakeSubscription(
      fakeSubscriptionCount,
    );
    return new ResponseDto(
      fakeSubscription,
      null,
      `${fakeSubscriptionCount}개의 페이크 구독 생성에 성공했습니다.`,
    );
  }

  /**
   * 페이크 리뷰 생성
   *
   *
   */
  @Get('/fakeReview')
  @ApiQuery({
    name: 'count',
    required: false,
    description: '생성할 구독의 개수',
    type: String,
  })
  async generateFakeReview(@Query('count') count?: string) {
    const fakeReviewCount = parseInt(count, 10) || 1;
    const fakeReview =
      await this.fakerService.generateFakeReview(fakeReviewCount);
    return new ResponseDto(
      fakeReview,
      null,
      `${fakeReviewCount}개의 페이크 리뷰 생성에 성공했습니다.`,
    );
  }
}

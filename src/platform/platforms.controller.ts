import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/response.dto';
import { PlatformVo } from './dto/platformVo';

@ApiTags('04. 플랫폼')
@Controller('platforms')
export class PlatformsController {
  constructor(
    @Inject(PlatformsService)
    private readonly platformService: PlatformsService,
  ) {}

  /**
   * 가격 변경
   *
   */
  @Get('platformPrice')
  @HttpCode(200)
  async renewPrice() {
    const price = Math.floor(Math.random() * 5000) + 15000; // 15000 ~ 19999 사이의 값
    const newPrice = Math.floor(price / 100) * 100;
    console.log(newPrice); // 가격 출력
    return { price: newPrice };
  }

  /**
   * 플랫폼 전체 조회
   *
   *
   */
  @Get()
  @ApiQuery({ name: 'sortId', type: String, description: '정렬 ID' })
  @HttpCode(200)
  async getAllPlatforms(
    @Query('sortId') sortId: string,
  ): Promise<ResponseDto<PlatformVo[]>> {
    return new ResponseDto(await this.platformService.findAllPlatforms(sortId));
  }

  /**
   * 전체 플랫폼 별점 Top5 조회
   *
   *
   */
  @Get('topRated')
  @HttpCode(200)
  async getTopRatedPlatforms(): Promise<ResponseDto<PlatformVo[]>> {
    return new ResponseDto(await this.platformService.getTopRatedPlatforms());
  }

  /**
   * 플랫폼 ID로 상세조회
   *
   */
  @Get(':id')
  @HttpCode(200)
  async getOnePlatformById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<PlatformVo>> {
    return new ResponseDto(await this.platformService.findOnePlatformById(id));
  }
}

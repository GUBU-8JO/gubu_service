import { Controller, Get, Param } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { ApiTags } from '@nestjs/swagger';
import {Platforms} from "./entities/platforms.entity";
import {PlatformVo} from "./dto/PlatformVo";

class ResponseDto<T> {
  errorMessage?: string
  data: T

  constructor(data: T = null, errorMessage?: string) {
    this.data = data
    this.errorMessage = errorMessage
  }
}

@ApiTags('PLATFORM API')
@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformService: PlatformsService) {}

  //카테고리 검색 : 아이디가 없을 때 모두조회가능
  // @Get()
  // findMany(@Query('categoryId') categoryId: number) {
  //   return { message: '카테고리 검색에 성공했습니다' };
  // }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ResponseDto<PlatformVo>> {
    return new ResponseDto(await this.platformService.findById(id))
  }

  //여러 플랫폼 가격 조회
  @Get()
  async getAllPlatforms(): Promise<ResponseDto<PlatformVo[]>> {
    const platforms = await this.platformService.findMany();
    return new ResponseDto(platforms)
  }
}

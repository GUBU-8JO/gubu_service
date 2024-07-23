import { Controller, Get, Param, Query } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  //카테고리 검색 : 아이디가 없을 때 모두조회가능
  @Get()
  findMany(@Query('categoryId') categoryId: number) {
    return { message: '메세지 :)' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }
}

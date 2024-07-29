import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '../common/response.dto';
import { PlatformVo } from '../platform/dto/platformVo';
import { CategoryVo } from './dto/categoryVo';

@ApiTags('카테고리 API')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAllCategory(): Promise<ResponseDto<CategoryVo[]>> {
    return new ResponseDto(await this.categoriesService.findAllCategory());
  }

  @Get(':id')
  async findPlatformByCategoryId(
    @Param('id') categoryId: number,
  ): Promise<ResponseDto<PlatformVo[]>> {
    return new ResponseDto(
      await this.categoriesService.findPlatformByCategoryId(categoryId),
    );
  }
}

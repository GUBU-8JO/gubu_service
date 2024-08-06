import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ResponseDto } from '../common/response.dto';
import { PlatformVo } from '../platform/dto/platformVo';
import { CategoryVo } from './dto/categoryVo';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('03. 카테고리')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  /**
   * 카테고리 목록 조회
   *
   */
  @Get()
  async findAllCategory(): Promise<ResponseDto<CategoryVo[]>> {
    return new ResponseDto(await this.categoriesService.findAllCategory());
  }

  /**
   * 카테고리 ID로 플랫폼 조회
   *
   */
  @Get(':id')
  async findPlatformByCategoryId(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<ResponseDto<PlatformVo[]>> {
    return new ResponseDto(
      await this.categoriesService.findPlatformByCategoryId(categoryId),
    );
  }
}

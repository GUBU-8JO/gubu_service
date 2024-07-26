import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('카테고리 API')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiQuery({
    name: 'sortField',
    required: false,
    type: String,
    description:
      '정렬기준을 선택해주세요 ( id or category, 기본값은 id 입니다 )',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description:
      '오름차순 / 내림차순을 선택해주세요 ( ASC or DESC, 기본값은 ASC 입니다 )',
  })
  async findAll(
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    const categories = await this.categoriesService.findAll(
      sortField,
      sortOrder,
    );
    return {
      status: HttpStatus.OK,
      message: '카테고리 목록 조회에 성공했습니다.',
      data: categories,
    };
  }

  @Get(':id')
  async findPlatformByCategoryId(@Param('id') categoryId: number) {
    const platformsWithCategory =
      await this.categoriesService.findPlatformsByCategoryId(categoryId);
    return {
      status: HttpStatus.OK,
      message: '플랫폼 목록 조회에 성공했습니다.',
      data: platformsWithCategory,
    };
  }
}

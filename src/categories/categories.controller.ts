import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return { message: '카테고리 조회에 성공했습니다.' };
  }
}

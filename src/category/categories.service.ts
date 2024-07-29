import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { PlatformVo } from '../platform/dto/platformVo';
import { CategoryVo } from './dto/categoryVo';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAllCategory(): Promise<CategoryVo[]> {
    return await this.categoriesRepository.find();
  }

  async findPlatformByCategoryId(id: number): Promise<PlatformVo[]> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['platforms'],
    });

    if (!category) {
      throw new NotFoundException({
        message: '해당 카테고리가 존재하지 않습니다.',
      });
    }

    return category.platforms.map(
      (platform) =>
        new PlatformVo(
          platform.id,
          platform.title,
          platform.price,
          platform.image,
          platform.purchaseLink,
          platform.period,
        ),
    );
  }
}

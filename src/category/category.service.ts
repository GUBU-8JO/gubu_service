import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { PlatformVo } from '../platform/dto/platformVo';
import { CategoryVo } from './dto/categoryVo';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAllCategory(): Promise<CategoryVo[]> {
    return await this.categoryRepository.find({ relations: ['platform'] });
  }

  async findPlatformByCategoryId(id: number): Promise<PlatformVo[]> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['platform'],
    });

    if (!category) {
      throw new NotFoundException({
        message: '해당 카테고리가 존재하지 않습니다.',
      });
    }

    if (!category.platform || category.platform.length === 0) {
      return [];
    }

    const platforms = category.platform.map(
      (platform) =>
        new PlatformVo(
          platform.id,
          platform.title,
          platform.price,
          platform.rating,
          platform.image,
          platform.categoryId,
          platform.purchaseLink,
          platform.period,
        ),
    );

    return platforms;
  }
}

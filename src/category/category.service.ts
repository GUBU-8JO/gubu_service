import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { PlatformVo } from '../platform/dto/platformVo';
import { CategoryVo } from './dto/categoryVo';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAllCategory(): Promise<CategoryVo[]> {
    return await this.categoryRepository.find({ relations: ['platform'] });
  }

  async findPlatformByCategoryId(id: number): Promise<PlatformVo[]> {
    const platformByCategoryId = await this.categoryRepository.find({
      where: { id },
      relations: ['platform'],
    });

    if (!platformByCategoryId) {
      throw new NotFoundException({
        message: '해당 카테고리가 존재하지 않습니다.',
      });
    }

    const platforms = platformByCategoryId[0].platform.map(
      (el) =>
        new PlatformVo(
          el.id,
          el.title,
          el.price,
          el.rating,
          el.image,
          el.categoryId,
          el.purchaseLink,
          el.period,
        ),
    );

    return platforms;
  }
}

// const category = await this.categoryRepository.findOne({
//   where: { id },
//   relations: ['platform'],
// });

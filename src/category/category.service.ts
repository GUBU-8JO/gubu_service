import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { PlatformVo } from '../platform/dto/platformVo';
import { CategoryVo } from './dto/categoryVo';
import { Cron } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAllCategory(): Promise<CategoryVo[]> {
    return await this.categoryRepository.find({ relations: ['platform'] });
  }

  async findPlatformByCategoryId(id: number): Promise<PlatformVo[]> {
    const strId = id.toString();
    const categoryPlatform = await this.cacheManager.get<string>(strId);
    console.log('categoryPlatform' + categoryPlatform);

    const jsonCategoryPlatform = JSON.parse(categoryPlatform);

    if (!categoryPlatform) {
      throw new NotFoundException({
        message: '해당 카테고리가 존재하지 않습니다.',
      });
    }

    const platforms = jsonCategoryPlatform.platform.map(
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

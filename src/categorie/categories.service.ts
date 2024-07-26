import { Injectable } from '@nestjs/common';
import { Categories } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async findAll(sortField: string, sortOrder: string) {
    const order = {};
    if (sortField && sortOrder) {
      order[sortField] = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    } else {
      order['id'] = 'ASC'; // 기본 정렬 방식
    }

    return await this.categoriesRepository.find({ order });
  }

  async findPlatformsByCategoryId(categoryId: number) {
    const category = await this.categoriesRepository.findOneOrFail({
      where: { id: categoryId },
      relations: ['platform'],
    });
    // return category;

    const platformsWithCategory = category.platform.map((platform) => ({
      categoryId: platform.categoryId,
      category: category.category,
      id: platform.id,
      title: platform.title,
      image: platform.image,
      purchaseLink: platform.purchaseLink,
      price: platform.price,
      period: platform.period,
    }));
    return platformsWithCategory;
  }
}

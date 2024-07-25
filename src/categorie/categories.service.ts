import { Injectable } from '@nestjs/common';
import { Categories } from './entities/category.entity'
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
}
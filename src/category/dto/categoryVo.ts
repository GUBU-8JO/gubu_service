import { PlatformVo } from '../../platform/dto/platformVo';

export class CategoryVo {
  id: number;
  category: string;
  platforms: PlatformVo[];

  constructor(id: number, category: string, platforms: PlatformVo[] = []) {
    this.id = id;
    this.category = category;
    this.platforms = platforms;
  }
}

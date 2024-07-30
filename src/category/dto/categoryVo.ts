import { PlatformVo } from '../../platform/dto/platformVo';

export class CategoryVo {
  id: number;
  category: string;
  platform: PlatformVo[];

  constructor(id: number, category: string, platform: PlatformVo[] = []) {
    this.id = id;
    this.category = category;
    this.platform = platform;
  }
}

import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ApiTags } from '@nestjs/swagger';
import { SetCacheDto } from './dto/create-cache.dto';

@ApiTags('09. cashe')
@Controller('cache')
export class CacheController {
  constructor(private cacheService: CacheService) {}

  /**
   * 캐시 생성
   * @returns
   */
  @Post('set')
  async setCache(@Body() setCacheDto: SetCacheDto) {
    const { key, value } = setCacheDto;
    await this.cacheService.setCache(key, value);
    return { message: `Cache set for key: ${key}` };
  }

  @Get('get/:key')
  async getCache(@Param('key') key: string) {
    const value = await this.cacheService.getCache(key);
    return value;
  }

  @Delete('delete/:key')
  async deleteCache(@Param('key') key: string) {
    await this.cacheService.delCache(key);
    return { message: `Cache deleted for key: ${key}` };
  }

  @Delete('reset')
  async resetCache() {
    await this.cacheService.resetCache();
    return { message: 'All cache has been reset' };
  }
}

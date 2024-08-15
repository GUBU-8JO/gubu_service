import { Module } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { PlatformsController } from './platforms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from './entities/platforms.entity';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Platform]), CacheModule],
  controllers: [PlatformsController],
  providers: [PlatformsService, CacheService],
})
export class PlatformsModule {}

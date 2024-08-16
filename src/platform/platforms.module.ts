import { Module } from '@nestjs/common';
import { PlatformsController } from './platforms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from './entities/platforms.entity';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from 'src/cache/cache.module';
import { PlatformRepository } from './platforms.repository';
import { PlatformsService } from './platforms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Platform]), CacheModule],
  controllers: [PlatformsController],
  providers: [PlatformsService, CacheService, PlatformRepository],
})
export class PlatformsModule {}

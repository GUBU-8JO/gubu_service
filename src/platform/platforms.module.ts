import { Module } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { PlatformsController } from './platforms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platforms } from './entities/platforms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Platforms])],
  controllers: [PlatformsController],
  providers: [PlatformsService],
})
export class PlatformsModule {}

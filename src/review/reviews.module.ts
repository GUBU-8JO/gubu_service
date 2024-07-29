import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from './entities/review.entity';
import { Platform } from 'src/platform/entities/platforms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reviews, Platform])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

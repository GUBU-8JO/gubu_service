import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FakerController } from './faker.controller';
import { FakerService } from './faker.service';
import { User } from 'src/user/entities/user.entity';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import { SubscriptionHistory } from 'src/user/entities/subscription-histories.entity';
import { Review } from 'src/review/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserSubscription,
      SubscriptionHistory,
      Review,
    ]),
  ],
  controllers: [FakerController],
  providers: [FakerService],
})
export class FakerModule {}

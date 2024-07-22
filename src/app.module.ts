import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UserSubscriptionsModule } from './user-subscriptions/user-subscriptions.module';
import { SubscriptionHistoriesModule } from './subscription-histories/subscription-histories.module';
import { ServicesModule } from './services/services.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, AuthModule, ReviewsModule, NotificationsModule, UserSubscriptionsModule, SubscriptionHistoriesModule, ServicesModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

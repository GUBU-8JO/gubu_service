import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './review/reviews.module';
import { NotificationsModule } from './notification/notifications.module';
import { UserSubscriptionsModule } from './user/user-subscriptions.module';
import { SubscriptionHistoriesModule } from './user/subscription-histories.module';
import { PlatformsModule } from './platform/platforms.module';
import { CategoriesModule } from './categorie/categories.module';
import { ConfigModuleValidationSchema } from './configs/env-validation.config';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: Number(configService.get('DB_PORT')),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: configService.get('DB_SYNC'),
    autoLoadEntities: true,
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UserModule,
    AuthModule,
    ReviewsModule,
    NotificationsModule,
    UserSubscriptionsModule,
    SubscriptionHistoriesModule,
    PlatformsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

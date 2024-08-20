import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Platform } from 'src/platform/entities/platforms.entity';
import { SubscriptionHistory } from './entities/subscription-histories.entity';
import _ from 'lodash';
import { UserSubscriptionVo } from './dto/user-subscription-responseDto/userSubscriptionVo';
import { UserSubscriptionUpdateVo } from './dto/userSubscriptionUpdateVo';
import { SubscriptionHistoryVo } from './dto/user-subscription-responseDto/subscriptionHistoryVo';
import { PlatformVo } from '../category/dto/platformVo';
import bcrypt from 'bcrypt';
import { MySubscriptionVo } from './dto/mySubscriptionVo';
import { createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';
import { CacheService } from 'src/cache/cache.service';
import { UserSubscriptionRepository } from './user-subscriptions.repository';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    private readonly userSubscriptionRepository: UserSubscriptionRepository,
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
    @InjectRepository(SubscriptionHistory)
    private readonly subscriptionHistory: Repository<SubscriptionHistory>,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {}
  async create(
    {
      startedDate,
      paymentMethod,
      period,
      accountId,
      accountPw,
      price,
    }: CreateUserSubscriptionDto,
    userId: number,
    platformId: number,
  ): Promise<UserSubscriptionVo> {
    const existPlatform = await this.platformRepository.findOne({
      where: { id: platformId },
    });

    if (!existPlatform)
      throw new NotFoundException({
        status: 404,
        message: '등록되지않은 플랫폼입니다.',
      });

    const existingSubscription =
      await this.userSubscriptionRepository.checkSubscription(
        userId,
        platformId,
      );

    if (existingSubscription)
      throw new BadRequestException({
        message: '이미 구독중인 플랫폼 입니다.',
      });

    // startedDate를 Date 객체로 변환
    const startedDateObj = new Date(startedDate);

    const newSubscription = await this.userSubscriptionRepository.saveSubscription(
      startedDate,
      paymentMethod,
      period,
      platformId,
      accountId,
      accountPw,
      userId,
      price,
    );

    const nextPayAt = this.calculateNextDate(startedDateObj, period);

    await this.subscriptionHistory.save({
      userSubscriptionId: newSubscription.id,
      startAt: startedDateObj,
      nextPayAt: nextPayAt,
      price: newSubscription.price,
      stopDate: null,
      userSubscription: newSubscription,
    });

    return new UserSubscriptionVo(
      newSubscription.id,
      newSubscription.platformId,
      newSubscription.period,
      newSubscription.price,
      newSubscription.paymentMethod,
      newSubscription.startedDate,
      newSubscription.accountId,
      newSubscription.accountPw,
      newSubscription.userId,
    );
  }
  // 다음 날짜 계산 함수 (월 단위로 증가)
  private calculateNextDate(startedDate: Date, period: number): Date {
    const nextDate = new Date(startedDate);
    nextDate.setMonth(nextDate.getMonth() + period); // period 만큼 월 증가
    return nextDate;
  }

  async findAllMe(userId: number): Promise<MySubscriptionVo[]> {
    const data = await this.userSubscriptionRepository.findAllMe(userId);

    if (!data.length) {
      throw new NotFoundException({
        status: 404,
        message: '해당 유저에 대한 등록된 구독목록이 없습니다.',
      });
    }

    return data.map((subscription) => {
      return new MySubscriptionVo(
        subscription.id,
        subscription.platformId,
        subscription.period,
        subscription.price,
        subscription.paymentMethod,
        subscription.startedDate,
        subscription.subscriptionHistory[0]?.nextPayAt,
        subscription.platform.image,
        undefined,
        new PlatformVo(undefined, subscription.platform.title, undefined),
      );
    });
  }

  async findAllMeCache(userId: number): Promise<MySubscriptionVo[]> {
    const userSubscriptionCacheKeyByUserId = `userSubscriptionByUserId:${userId}`;
    const userSubscriptionCacheDataByUserId = await this.cacheService.getCache(
      userSubscriptionCacheKeyByUserId,
    );

    if (_.isNil(userSubscriptionCacheDataByUserId)) {
      const userSubscriptionDataByUserId =
        await this.userSubscriptionRepository.findAllMe(userId);
      if (_.isNil(userSubscriptionDataByUserId)) {
        throw new NotFoundException({
          status: 404,
          message: '해당 유저에 대한 등록된 구독목록이 없습니다.',
        });
      }
      const jsonUserSubscriptionCacheDataByUserId = JSON.stringify(
        userSubscriptionDataByUserId,
      );
      await this.cacheService.setCache(
        userSubscriptionCacheKeyByUserId,
        jsonUserSubscriptionCacheDataByUserId,
        { ttl: 3600 } as any,
      );

      return userSubscriptionDataByUserId.map((subscription) => {
        return new MySubscriptionVo(
          subscription.id,
          subscription.platformId,
          subscription.period,
          subscription.price,
          subscription.paymentMethod,
          subscription.startedDate,
          subscription.subscriptionHistory[0]?.nextPayAt,
          subscription.platform.image,
          undefined,
          new PlatformVo(undefined, subscription.platform.title, undefined),
        );
      });
    } else {
      const jsonUserSubscriptionCacheDataByUserId = JSON.parse(
        userSubscriptionCacheDataByUserId,
      );

      return jsonUserSubscriptionCacheDataByUserId.map((subscription) => {
        return new MySubscriptionVo(
          subscription.id,
          subscription.platformId,
          subscription.period,
          subscription.price,
          subscription.paymentMethod,
          subscription.startedDate,
          subscription.subscriptionHistory[0]?.nextPayAt,
          subscription.platform.image,
          undefined,
          new PlatformVo(undefined, subscription.platform.title, undefined),
        );
      });
    }
  }

  async findOne(id: number): Promise<UserSubscriptionVo> {
    const subscription = await this.userSubscriptionRepository.findSubscriptionById(id);
    if (!subscription) {
      throw new NotFoundException(`해당하는 구독정보가 없습니다.`);
    }

    const decryptedAccountId = await this.decryption(subscription.accountId);
    const decryptedAccountPw = await this.decryption(subscription.accountPw);

    const platform = subscription.platform;
    const platformVo = new PlatformVo(
      platform.id,
      platform.title,
      platform.price,
      platform.image,
      platform.purchaseLink,
      platform.period,
      platform.rating,
    );

    const subscriptionHistoryVos = subscription.subscriptionHistory.map(
      (history) =>
        new SubscriptionHistoryVo(
          history.id,
          history.userSubscriptionId,
          history.price,
          history.startAt,
          history.nextPayAt,
          history.stopRequestAt,
        ),
    );

    return new UserSubscriptionVo(
      subscription.id,
      subscription.platformId,
      subscription.period,
      subscription.price,
      subscription.paymentMethod,
      subscription.startedDate,
      decryptedAccountId,
      decryptedAccountPw,
      subscription.userId,
      subscriptionHistoryVos,
      platformVo,
    );
  }
  async findInfo(id: number, password: string) {
    const subscriptionInfo =
      await this.userSubscriptionRepository.findInfoById(id);
    if (!subscriptionInfo) {
      throw new UnauthorizedException('해당하는 구독정보가 없습니다.');
    }

    const user = subscriptionInfo.user;

    const isPasswordValid = await this.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    return subscriptionInfo;
  }

  //입력한 비밀번호와 해시된 비밀번호 비교하는 함수
  private async comparePasswords(
    rePassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(rePassword, hashedPassword);
  }

  async update(
    id: number,
    {
      startedDate,
      paymentMethod,
      period,
      accountId,
      accountPw,
      price,
    }: UpdateUserSubscriptionDto,
  ): Promise<UserSubscriptionUpdateVo> {
    const existUserSubscription =
      await this.userSubscriptionRepository.findById(id);

    if (!existUserSubscription)
      throw new NotFoundException({ message: '등록되지않는 구독정보입니다.' });
    const newdata =
      existUserSubscription.startedDate === startedDate &&
      existUserSubscription.paymentMethod === paymentMethod &&
      existUserSubscription.period === period &&
      existUserSubscription.accountId === accountId &&
      existUserSubscription.accountPw === accountPw &&
      existUserSubscription.price === price;
    if (newdata) {
      throw new BadRequestException({ message: '변경된 정보가 없습니다.' });
    }
    await this.userSubscriptionRepository.updateSubscription(
      id,
      startedDate,
      paymentMethod,
      period,
      accountId,
      accountPw,
      price,
    );

    const updatedSubscription = await this.userSubscriptionRepository.findById(id);

    return new UserSubscriptionUpdateVo(
      updatedSubscription.startedDate,
      updatedSubscription.paymentMethod,
      updatedSubscription.period,
      updatedSubscription.accountId,
      updatedSubscription.accountPw,
      price,
    );
  }

  async remove(id: number) {
    const existData = await this.userSubscriptionRepository.findNotDeleted(id);
    if (_.isNil(existData))
      throw new BadRequestException({
        message: '데이터가 존재하지 않습니다.',
      });

    await this.userSubscriptionRepository.deleteSubscription(id);

    await this.subscriptionHistory.update(
      { userSubscriptionId: id },
      { stopRequestAt: new Date() },
    );

    return true;
  }

  private async decryption(data) {
    const encryptedDataBufferFromHex = Buffer.from(data, 'hex');

    const DataIv = encryptedDataBufferFromHex.slice(0, 16);
    const encryptedData = encryptedDataBufferFromHex.slice(16);

    const password = this.configService.get('CRYPTO_PASSWORD');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const DataDecipher = createDecipheriv('aes-256-ctr', key, DataIv);

    const decryptedBufferData = Buffer.concat([
      DataDecipher.update(encryptedData),
      DataDecipher.final(),
    ]);

    const decryptedData = decryptedBufferData.toString();

    return decryptedData;
  }
}

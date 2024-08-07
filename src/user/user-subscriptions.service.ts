import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscription } from './entities/user-subscription.entity';
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
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
    @InjectRepository(SubscriptionHistory)
    private readonly subscriptionHistory: Repository<SubscriptionHistory>,
    private readonly configService: ConfigService,
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

    const existingSubscription = await this.userSubscriptionRepository.findOne({
      where: {
        userId: userId,
        platformId: platformId,
      },
    });

    if (existingSubscription)
      throw new BadRequestException({
        message: '이미 구독중인 플랫폼 입니다.',
      });

    const iv = randomBytes(16);
    const password = this.configService.get('CRYPTO_PASSWORD');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const textToEncrypt = accountPw;
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    // iv를 암호화된 데이터 앞에 붙임
    const encryptedPassword = Buffer.concat([iv, encryptedText]).toString(
      'hex',
    );

    // startedDate를 Date 객체로 변환
    const startedDateObj = new Date(startedDate);

    const data = await this.userSubscriptionRepository.save({
      startedDate,
      paymentMethod,
      period,
      platformId,
      accountId,
      accountPw: encryptedPassword,
      userId,
      price,
    });

    const nextPayAt = this.calculateNextDate(startedDateObj, period);

    await this.subscriptionHistory.save({
      userSubscriptionId: data.id,
      startAt: startedDateObj,
      nextPayAt: nextPayAt,
      price: data.price,
      stopDate: null,
      userSubscription: data,
    });

    return new UserSubscriptionVo(
      data.id,
      data.platformId,
      data.period,
      data.price,
      data.paymentMethod,
      data.startedDate,
      data.accountId,
      data.accountPw,
      data.userId,
    );
  }
  // 다음 날짜 계산 함수 (월 단위로 증가)
  private calculateNextDate(startedDate: Date, period: number): Date {
    const nextDate = new Date(startedDate);
    nextDate.setMonth(nextDate.getMonth() + period); // period 만큼 월 증가
    return nextDate;
  }

  async findAllMe(userId: number): Promise<MySubscriptionVo[]> {
    const data = await this.userSubscriptionRepository.find({
      where: { userId },
      select: [
        'id',
        'platformId',
        'period',
        'price',
        'startedDate',
        'paymentMethod',
      ],
      relations: ['platform', 'subscriptionHistory'],
    });

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
  async findOne(id: number): Promise<UserSubscriptionVo> {
    const data = await this.userSubscriptionRepository.findOne({
      where: { id },
      select: [
        'id',
        'platformId',
        'period',
        'price',
        'paymentMethod',
        'startedDate',
        'accountId',
        'accountPw',
        'userId',
      ],
      relations: ['platform', 'subscriptionHistory'],
    });
    if (!data) {
      throw new NotFoundException(`해당하는 구독정보가 없습니다.`);
    }

    const encryptedBufferFromHex = Buffer.from(data.accountPw, 'hex');

    // 암호화된 데이터에서 iv를 추출
    const iv = encryptedBufferFromHex.slice(0, 16);
    const encryptedText = encryptedBufferFromHex.slice(16);

    const password = this.configService.get('CRYPTO_PASSWORD');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    const decryptedAccountPw = decryptedText.toString();

    const platform = data.platform;
    const platformVo = new PlatformVo(
      platform.id,
      platform.title,
      platform.price,
      platform.image,
      platform.purchaseLink,
      platform.period,
      platform.rating,
    );

    const subscriptionHistoryVos = data.subscriptionHistory.map(
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
      data.id,
      data.platformId,
      data.period,
      data.price,
      data.paymentMethod,
      data.startedDate,
      data.accountId,
      decryptedAccountPw,
      data.userId,
      subscriptionHistoryVos,
      platformVo,
    );
  }
  async findInfo(id: number, password: string) {
    const subscriptionInfo = await this.userSubscriptionRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          password: true,
        },
      },
    });
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
    const existUserSubscription = await this.userSubscriptionRepository.findOne(
      {
        where: { id },
      },
    );

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
    await this.userSubscriptionRepository.update(
      { id },
      {
        startedDate,
        paymentMethod,
        period,
        accountId,
        accountPw,
        price,
      },
    );

    const data = await this.userSubscriptionRepository.findOne({
      where: { id },
    });

    return new UserSubscriptionUpdateVo(
      data.startedDate,
      data.paymentMethod,
      data.period,
      data.accountId,
      data.accountPw,
      price,
    );
  }

  async remove(id: number) {
    const existData = await this.userSubscriptionRepository.findOne({
      where: { id },
      withDeleted: false,
    });
    if (_.isNil(existData))
      throw new BadRequestException({
        message: '데이터가 존재하지 않습니다.',
      });

    await this.userSubscriptionRepository.softDelete(id);

    await this.subscriptionHistory.update(
      { userSubscriptionId: id },
      { stopRequestAt: new Date() },
    );

    return true;
  }
}

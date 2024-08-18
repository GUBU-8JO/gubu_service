import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserSubscription } from './entities/user-subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import _ from 'lodash';

@Injectable()
export class UserSubscriptionRepository {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly repository: Repository<UserSubscription>,
    private readonly configService: ConfigService,
  ) {}

  async findAllMe(userId: number) {
    const userSubData = await this.repository.find({
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
    return userSubData;
  }

  async findById(id: number) {
    const subscription = await this.repository.findOne({
      where: { id },
    });
    return subscription;
  }

  async findSubscriptionById(id: number): Promise<UserSubscription> {
    const findUserSub = await this.repository.findOne({
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
    return findUserSub;
  }
  //구독 확인
  async checkSubscription(userId: number, platformId: number) {
    const existSubscription = await this.repository.findOne({
      where: { userId, platformId },
    });
    return existSubscription;
  }
  //구독 등록
  async saveSubscription(
    startedDate: string,
    paymentMethod: string,
    period: number,
    platformId: number,
    accountId: string,
    accountPw: string,
    userId: number,
    price: number,
  ) {
    const encryptedId = await this.encryption(accountId);
    const encryptedPassword = await this.encryption(accountPw);

    const data = await this.repository.save({
      startedDate,
      paymentMethod,
      period,
      platformId,
      accountId: encryptedId,
      accountPw: encryptedPassword,
      userId,
      price,
    });
    return data;
  }

  //계정정보 확인
  async findInfoById(id: number) {
    const subscriptionInfo = await this.repository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          password: true,
        },
      },
    });
    return subscriptionInfo;
  }
  //암호화함수
  async encryption(data) {
    const iv = randomBytes(16);
    const cryptoPassword = this.configService.get('CRYPTO_PASSWORD');
    const key = (await promisify(scrypt)(cryptoPassword, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedata = Buffer.concat([cipher.update(data), cipher.final()]);

    const encryptedByConcatIvData = Buffer.concat([iv, encryptedata]).toString(
      'hex',
    );

    return encryptedByConcatIvData;
  }
  //업데이트
  async updateSubscription(
    id: number,
    startedDate: string,
    paymentMethod: string,
    period: number,
    accountId: string,
    accountPw: string,
    price: number,
  ) {
    let encryptedId = accountId;
    let encryptedPassword = accountPw;

    if (!_.isNil(accountId)) {
      encryptedId = await this.encryption(accountId);
    }

    if (!_.isNil(accountPw)) {
      encryptedPassword = await this.encryption(accountPw);
    }

    const newSubscription = await this.repository.update(
      { id },
      {
        startedDate,
        paymentMethod,
        period,
        accountId: encryptedId,
        accountPw: encryptedPassword,
        price,
      },
    );
    return newSubscription;
  }

  async findNotDeleted(id: number) {
    const existData = await this.repository.findOne({
      where: { id },
      withDeleted: false,
    });
    return existData;
  }

  async deleteSubscription(id: number) {
    const deletedData = await this.repository.softDelete(id);
    return deletedData;
  }
}

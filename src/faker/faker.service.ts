import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { faker as fakerKO } from '@faker-js/faker/locale/ko';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import { SubscriptionHistory } from 'src/user/entities/subscription-histories.entity';
import bcrypt from 'bcrypt';
import _ from 'lodash';

@Injectable()
export class FakerService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(SubscriptionHistory)
    private readonly subscriptionHistory: Repository<SubscriptionHistory>,
  ) {}

  async generateFakeUsers(count: number) {
    const fakeUsers = [];
    for (let i = 0; i < count; i++) {
      let firstName = fakerKO.person.firstName();
      let lastName = fakerKO.person.lastName();
      let email = faker.internet.email();
      const fakeUser = {
        email,
        nickname: lastName + firstName,
        password: faker.internet.password(),
      };
      const hashedPassword = await this.encryptPassword(fakeUser.password);
      try {
        const saveFakeUser = await this.userRepository.save({
          ...fakeUser,
          password: hashedPassword,
        });
        fakeUsers.push({
          id: saveFakeUser.id,
          email: saveFakeUser.email,
          nickname: saveFakeUser.nickname,
        });
      } catch (err) {
        throw new InternalServerErrorException(
          '페이크 유저 생성에 실패했습니다.',
        );
      }
    }
    return fakeUsers;
  }

  // const startDate = new Date('2024-05-31');
  // const startDate = new Date('2024-06-30'); > 마지막 날자로 가는지 쳌

  async generateFakeReview() {
    const fakeReviews = [];
    let userId = faker.number.int({ min: 1, max: 1000 });
    let platformId = faker.number.int({ min: 1, max: 25 });
    let rate = faker.number.int({ min: 1, max: 5 });
    let comment = faker.lorem.paragraph();
    let createdAt = faker.date
      .betweens({
        from: new Date('2024-05-30'),
        to: new Date('2024-08-06'),
      })[0]
      .toISOString()
      .split('T')[0];

    fakeReviews.push({
      userId,
      platformId,
      rate,
      comment,
      createdAt,
    });
    return fakeReviews;
  }

  async generateFakeSubscription(count: number) {
    const fakeSubscriptions = [];
    for (let i = 0; i < count; i++) {
      let userId: number;
      let platformId: number;
      let price = faker.number.int({ min: 5, max: 100 }) * 1000;
      let startedDate = faker.date
        .betweens({
          from: new Date('2024-05-30'),
          to: new Date('2024-08-06'),
        })[0]
        .toISOString()
        .split('T')[0];
      let paymentMethod = faker.finance.creditCardIssuer();
      let period = faker.number.int({ min: 1, max: 3 });
      let accountPw = faker.internet.password();
      const maxAttempts = 100;
      let attempts = 0;

      // 중복되지 않는 userId, platformId 검출
      while (attempts < maxAttempts) {
        attempts++;
        userId = faker.number.int({ min: 1, max: 10000 });
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        if (!user) continue;
        platformId = faker.number.int({ min: 1, max: 25 });

        const existData = await this.userSubscriptionRepository.findOne({
          where: { userId, platformId },
        });
        if (!existData) break;
      }

      if (attempts === maxAttempts) {
        throw new InternalServerErrorException(
          '페이크 구독 정보 중복 검출에 실패했습니다.',
        );
      }

      let accountId = (
        await this.userRepository.findOne({ where: { id: userId } })
      ).email;

      const fakeSubscription = {
        userId,
        platformId,
        startedDate,
        paymentMethod,
        period,
        accountId,
        accountPw,
        price,
      };

      try {
        const savedSubscription =
          await this.userSubscriptionRepository.save(fakeSubscription);

        const startedDateObj = new Date(startedDate);
        const nextPayAt = this.calculateNextDate(startedDateObj, period);
        const subscriptionHistory = await this.subscriptionHistory.save({
          userSubscriptionId: savedSubscription.id,
          startAt: startedDate,
          nextPayAt: nextPayAt,
          price: price,
          stopDate: null,
          userSubscription: savedSubscription,
        });

        fakeSubscriptions.push(subscriptionHistory);
      } catch (err) {
        throw new InternalServerErrorException(
          '페이크 구독 정보 생성에 실패했습니다.',
        );
      }
    }
    return fakeSubscriptions;
  }

  // 비밀번호 해싱
  private async encryptPassword(password: string) {
    const hashRounds = this.configService.get<number>('HASH_ROUNDS');
    return bcrypt.hash(password, hashRounds);
  }

  // 다음 결제일 계산기
  private calculateNextDate(startedDate: Date, period: number): Date {
    const nextDate = new Date(startedDate);
    nextDate.setMonth(nextDate.getMonth() + period);
    return nextDate;
  }
}

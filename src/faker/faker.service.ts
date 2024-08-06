import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { faker as fakerKO } from '@faker-js/faker/locale/ko';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import { SubscriptionHistory } from 'src/user/entities/subscription-histories.entity';
import { Review } from 'src/review/entities/review.entity';
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
    private readonly subscriptionHistoryRepository: Repository<SubscriptionHistory>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  // 페이크 유저 생성
  async generateFakeUsers(count: number) {
    const fakeUsers = [];
    for (let i = 0; i < count; i++) {
      let email: string;
      let existUser: Object;

      // 중복 이메일 검증
      // existUser 가 거짓(중복 이메일 없을 때 )일 때 다음 로직 수행
      do {
        email = faker.internet.email();
        existUser = await this.userRepository.count({ where: { email } });
      } while (existUser);

      let firstName = fakerKO.person.firstName();
      let lastName = fakerKO.person.lastName();
      let nickname = lastName + firstName;
      let password = await this.encryptPassword(faker.internet.password());

      const fakeUser = {
        email,
        nickname,
        password,
      };

      try {
        const saveFakeUser = await this.userRepository.save(fakeUser);
        fakeUsers.push({
          id: saveFakeUser.id,
          email: saveFakeUser.email,
          nickname: saveFakeUser.nickname,
        });
      } catch (err) {
        throw new InternalServerErrorException(
          `페이크 유저 생성에 실패했습니다: ${err.message}`,
        );
      }
    }
    return fakeUsers;
  }

  // const startDate = new Date('2024-05-31');
  // const startDate = new Date('2024-06-30'); > 마지막 날자로 가는지 쳌

  // 페이크 리뷰 생성
  async generateFakeReview(count: number) {
    const fakeReviews = [];
    const generateRandomRating = (): number => {
      const random = Math.random();
      if (random < 0.8) return faker.number.int({ min: 1, max: 3 });
      else return faker.number.int({ min: 4, max: 5 });
    };

    for (let i = 0; i < count; i++) {
      let userId: number;
      let platformId: number;
      // const rate: number = faker.number.int({ min: 1, max: 5 });
      const rate: number = generateRandomRating();
      // const comment: string = fakerKO.lorem.paragraphs(2);
      const comment: string = faker.lorem.sentence(3);

      const createdAt: string = faker.date
        .betweens({
          from: new Date('2024-05-30'),
          to: new Date('2024-08-06'),
        })[0]
        .toISOString()
        .split('T')[0];
      let attempts = 0;
      const maxAttempts = 100;

      // 중복되지 않는 userId, platformId 검출
      while (attempts < maxAttempts) {
        attempts++;
        userId = faker.number.int({ min: 1, max: 10000 });
        const user = await this.userRepository.count({
          where: { id: userId },
        });
        if (!user) continue;
        platformId = faker.number.int({ min: 1, max: 25 });

        const existData = await this.reviewRepository.count({
          where: { userId, platformId },
        });
        if (!existData) break;
      }

      if (attempts === maxAttempts) {
        throw new InternalServerErrorException(
          '페이크 리뷰 중복 검출에 실패했습니다.',
        );
      }

      const fakeReview = {
        userId,
        platformId,
        rate,
        comment,
        createdAt,
      };

      try {
        fakeReviews.push(await this.reviewRepository.save(fakeReview));
      } catch (err) {
        throw new InternalServerErrorException(
          '페이크 리뷰 정보 생성에 실패했습니다.',
        );
      }
    }
    return fakeReviews;
  }

  // 페이크 구독 생성
  async generateFakeSubscription(count: number) {
    const fakeSubscriptions = [];
    for (let i = 0; i < count; i++) {
      let userId: number;
      let platformId: number;
      let price: number = faker.number.int({ min: 5, max: 100 }) * 1000;
      let startedDate: string = faker.date
        .betweens({
          from: new Date('2024-05-30'),
          to: new Date('2024-08-06'),
        })[0]
        .toISOString()
        .split('T')[0];
      let paymentMethod = faker.finance.creditCardIssuer();
      let period = faker.number.int({ min: 1, max: 3 });
      let accountPw = faker.internet.password();
      let attempts = 0;
      const maxAttempts = 100;

      // 중복되지 않는 userId, platformId 검출
      while (attempts < maxAttempts) {
        attempts++;
        userId = faker.number.int({ min: 1, max: 10000 });
        const user = await this.userRepository.count({
          where: { id: userId },
        });
        if (!user) continue;
        platformId = faker.number.int({ min: 1, max: 25 });

        const existData = await this.userSubscriptionRepository.count({
          where: { userId, platformId },
        });
        if (!existData) break;
      }

      if (attempts === maxAttempts) {
        throw new InternalServerErrorException(
          '페이크 구독 중복 검출에 실패했습니다.',
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
        const subscriptionHistory =
          await this.subscriptionHistoryRepository.save({
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

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import { SubscriptionHistory } from 'src/user/entities/subscription-histories.entity';
import { Review } from 'src/review/entities/review.entity';
import { faker } from '@faker-js/faker';
import { faker as fakerKO } from '@faker-js/faker/locale/ko';
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

  // 페이크 리뷰 생성
  async generateFakeReview(count: number) {
    const fakeReviews = [];
    const generateRandomRating = (isPositive: boolean): number => {
      const random = Math.random();
      if (isPositive) {
        // 긍정적인 리뷰: 90% 확률로 5~9점, 10% 확률로 10점
        if (random < 0.9) return faker.number.int({ min: 5, max: 9 });
        else return 10;
      } else {
        // 부정적인 리뷰: 1 ~ 5점
        return faker.number.int({ min: 1, max: 4 });
      }
    };

    const positiveReviews = [
      '정말 편리해서 계속 이용할 듯해요.',
      '새 기능이 자주 추가돼 만족해요.',
      '사용이 간단해서 좋습니다.',
      '품질이 좋아 계속 사용해요.',
      '가격 대비 좋은 서비스예요.',
      '업데이트로 더 편리해졌어요.',
      '여러 기기에서 이용할 수 있어요.',
      '매일 유용하게 활용 중입니다.',
      '고객 지원이 빨라 좋았습니다.',
      '새로운 기능이 흥미를 줍니다.',
      '안정적이고 문제없어요.',
      'UI가 직관적이라 편리해요.',
      '새로운 경험을 제공합니다.',
      '매끄럽게 작동합니다.',
      '더 유용해졌어요.',
      '믿음이 가는 서비스입니다.',
      '오래 사용해도 질리지 않아요.',
      '필요에 맞게 사용 가능해요.',
      '발전하는 서비스입니다.',
      '매일 잘 이용하고 있어요.',
      '다양한 콘텐츠가 있어요.',
      '사용료가 아깝지 않아요.',
      '매달 만족감을 줍니다.',
      '볼거리가 많아 좋습니다.',
      '가족이 함께 즐겨요.',
      '끊김 없이 잘 됩니다.',
      '계속 흥미를 느낍니다.',
      '기능이 늘어났어요.',
      '사용이 정말 간편해요.',
      '품질과 안정성이 좋아요.',
      '문제가 빠르게 해결돼요.',
      '기능들이 유용해요.',
      '다양한 경험을 줍니다.',
      '서비스가 점점 좋아져요.',
      '일상에 큰 도움이 돼요.',
      '유익한 기능이 많아요.',
      '맞춤형 경험을 제공해요.',
      '알찬 구성입니다.',
      '접근성이 좋아요.',
      '서비스가 안정적입니다.',
    ];

    const negativeReviews = [
      '사용 중 자주 끊겨서 불편해요.',
      '기능이 제대로 작동하지 않아요.',
      '고객 지원이 느리고 불친절해요.',
      '가격 대비 품질이 별로에요.',
      '업데이트 후 불안정해졌어요.',
      '사용법이 복잡하고 헷갈려요.',
      '콘텐츠가 다양하지 않아요.',
      '가끔 오류가 발생해요.',
      '새로운 기능이 불필요해요.',
      '서비스 개선이 필요해요.',
      '앱이 자주 충돌합니다.',
      '기능들이 쓸모가 없어요.',
      '문제가 해결되지 않아요.',
      '사용자 경험이 좋지 않아요.',
      '요금이 비싸요.',
      '사용 중 불편함이 많아요.',
      '기대에 미치지 못해요.',
      '화질이 안 좋아요.',
      '서비스가 자주 중단돼요.',
      '응답 속도가 느려요.',
      '사용이 복잡해서 불편합니다.',
      '기대보다 품질이 낮아요.',
      '가격 대비 기능이 부족해요.',
      '업데이트가 자주 없어요.',
      '지연이 자주 발생합니다.',
      '고객 지원이 느려요.',
      '인터페이스가 직관적이지 않아요.',
      '자주 끊겨서 불편합니다.',
      '기능이 제한적이에요.',
      '서비스 안정성이 떨어집니다.',
      '새로운 기능이 별로 없어요.',
      '문제가 자주 발생합니다.',
      '업데이트 후 문제가 생겼어요.',
      '유저 친화적이지 않아요.',
      '필요한 기능이 부족해요.',
      '비슷한 서비스보다 떨어집니다.',
      '가격이 비싸요.',
      '사용 중 불편함이 많아요.',
      '설정이 복잡해서 어렵습니다.',
      '광고가 너무 많아요.',
    ];

    const generateCustomCommentAndRating = (): {
      comment: string;
      rate: number;
    } => {
      const isPositive = Math.random() < 0.7; // 70% 확률로 긍정적인 리뷰 선택
      const comment = isPositive
        ? faker.helpers.arrayElement(positiveReviews)
        : faker.helpers.arrayElement(negativeReviews);
      const rate = generateRandomRating(isPositive);
      return { comment, rate };
    };

    for (let i = 0; i < count; i++) {
      let userId: number;
      let platformId: number;
      const { comment, rate } = generateCustomCommentAndRating();
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
    return true;
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

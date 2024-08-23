import { Injectable, Logger } from '@nestjs/common';
import { TotalPriceRepository } from './total-price.repository';

@Injectable()
export class TotalPriceService {
  private readonly logger = new Logger(TotalPriceService.name);

  constructor(private readonly totalPriceRepository: TotalPriceRepository) {}

  // 사용자별 월간 구독 금액 API
  async getUserMonthlySubscription(userId: number): Promise<number> {
    try {
      return await this.totalPriceRepository.getMonthlySubscriptionUser(userId);
    } catch (err) {
      this.logger.error('사용자 구독 금액 계산 실패', err.stack);
      throw new Error('사용자 구독 금액 계산 실패');
    }
  }
}

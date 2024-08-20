import { InjectRepository } from '@nestjs/typeorm';
import { Injectable} from '@nestjs/common';
import { Repository } from 'typeorm';
import { SubscriptionHistory } from './entities/subscription-histories.entity';

@Injectable()
export class TotalPriceRepository {
  constructor(
    @InjectRepository(SubscriptionHistory)
    private readonly repository: Repository<SubscriptionHistory>,
  ) {}
  async getMonthlySubscriptionUser(userId: number): Promise<number> {
   try{ const result = await this.repository.query(`
      SELECT COALESCE(SUM(sh.price), 0) AS total_price
      FROM user_subscription us
      INNER JOIN subscription_history sh
        ON us.id = sh.user_subscription_id
      WHERE us.user_id = ?
        AND LEFT(sh.start_at, 7) = LEFT(CURRENT_DATE, 7)
        AND us.deleted_at IS NULL
        AND (sh.stop_request_at IS NULL OR sh.start_at < sh.stop_request_at);
`, [userId]);

    return result[0]?.total_price || 0;
  }catch(err){
    console.error('총 구독 금액을 계산하는데 문제가 생겼습니다.', err)
    throw new Error('총 구독 금액을 계산하는데 문제가 생겼습니다')
  }
}
}
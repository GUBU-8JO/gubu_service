import { SubscriptionHistoryVo } from './subscriptionHistoryVo';
import { PlatformVo } from "../../../category/dto/platformVo";

export class UserSubscriptionVo {
  id: number;
  platformId: number;
  period: number;
  price: number;
  paymentMethod: string;
  startedDate: string;
  accountId?: string;
  accountPw?: string;
  userId?: number;
  subscriptionHistory: SubscriptionHistoryVo[];
  platformVo: PlatformVo;

  constructor(
    id: number,
    platformId: number,
    period: number,
    price: number,
    paymentMethod: string,
    startedDate: string,
    accountId?: string,
    accountPw?: string,
    userId?: number,
    subscriptionHistory?: SubscriptionHistoryVo[],
    platformVo?: PlatformVo,
  ) {
    this.id = id;
    this.platformId = platformId;
    this.period = period;
    this.price = price;
    this.paymentMethod = paymentMethod;
    this.startedDate = startedDate;
    this.accountId = accountId;
    this.accountPw = accountPw;
    this.userId = userId;
    this.subscriptionHistory = subscriptionHistory;
    this.platformVo = platformVo;
  }
}

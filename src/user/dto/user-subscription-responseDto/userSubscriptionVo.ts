export class UserSubscriptionVo {
  id: number;
  startedDate: string;
  period: number;
  platformId: number;
  paymentMethod?: string;
  accountId?: string;
  accountPw?: string;
  userId?: number;
  price?: number;

  constructor(
    id: number,
    startedDate: string,
    period: number,
    platformId: number,
    paymentMethod?: string,
    accountId?: string,
    accountPw?: string,
    userId?: number,
    price?: number,
  ) {
    this.id = id;
    this.startedDate = startedDate;
    this.paymentMethod = paymentMethod;
    this.period = period;
    this.platformId = platformId;
    this.accountId = accountId;
    this.accountPw = accountPw;
    this.userId = userId;
    this.price = price;
  }
}

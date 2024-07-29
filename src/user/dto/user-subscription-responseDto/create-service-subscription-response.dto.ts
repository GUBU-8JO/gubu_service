export class UserSubscriptionsSerVo {
  startedDate: string;
  paymentMethod: string;
  period: number;
  accountId: string;
  accountPw: string;
  userId: number;
  platformId: number;
  constructor(
    startedDate: string,
    paymentMethod: string,
    period: number,
    accountId: string,
    accountPw: string,
    userId: number,
    platformId: number,
  ) {
    this.startedDate = startedDate;
    this.paymentMethod = paymentMethod;
    this.period = period;
    this.accountId = accountId;
    this.accountPw = accountPw;
    this.userId = userId;
    this.platformId = platformId;
  }
}

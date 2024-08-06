export class UserSubscriptionUpdateVo {
  startedDate: string;
  paymentMethod: string;
  period: number;
  accountId?: string;
  accountPw?: string;
  price?: number;

  constructor(
    startedDate: string,
    paymentMethod: string,
    period: number,
    accountId?: string,
    accountPw?: string,
    price?: number,
  ) {
    this.startedDate = startedDate;
    this.paymentMethod = paymentMethod;
    this.period = period;
    this.accountId = accountId;
    this.accountPw = accountPw;
    this.price = price;
  }
}

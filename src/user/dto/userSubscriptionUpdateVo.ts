export class UserSubscriptionUpdateVo {
  startedDate: string;
  paymentMethod: string;
  period: number;
  accountId?: string;
  accountPw?: string;

  constructor(
    startedDate: string,
    paymentMethod: string,
    period: number,
    accountId?: string,
    accountPw?: string,
  ) {
    this.startedDate = startedDate;
    this.paymentMethod = paymentMethod;
    this.period = period;
    this.accountId = accountId;
    this.accountPw = accountPw;
  }
}

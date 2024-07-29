import { UserSubscriptionsContVo } from './create-control-subscription-response.dto';

export class UserSubscriptionsReadVo extends UserSubscriptionsContVo {
  constructor(
    startedDate: string,
    paymentMethod: string,
    period: number,
    accountId: string,
    accountPw: string,
    userId: number,
    platformId: number,
  ) {
    super(
      startedDate,
      paymentMethod,
      period,
      accountId,
      accountPw,
      userId,
      platformId,
    );
  }
}

import { UserSubscriptionsSerVo } from './create-service-subscription-response.dto';

export class UserSubscriptionsContVo {
  status: number;
  message: string;
  data: UserSubscriptionsSerVo;
}

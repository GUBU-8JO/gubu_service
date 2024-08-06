import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import { SubscriptionHistory } from 'src/user/entities/subscription-histories.entity';

export class NotificationfindAllVo {
  id: number;
  title: string;
  isRead: boolean;
  userSubscription: UserSubscription[];
  subscriptionHistory: SubscriptionHistory[];

  constructor(
    id: number,
    title: string,
    isRead: boolean,
    userSubscription: UserSubscription[] = [],
    subscriptionHistory: SubscriptionHistory[] = [],
  ) {
    this.id = id;
    this.title = title;
    this.isRead = isRead;
    this.userSubscription = userSubscription;
    this.subscriptionHistory = subscriptionHistory;
  }
}

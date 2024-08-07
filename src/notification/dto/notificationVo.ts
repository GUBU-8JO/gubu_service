import { SubscriptionHistory } from 'src/user/entities/subscription-histories.entity';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';

export class NotificationVo {
  id: number;
  title: string;
  isRead: boolean;
  createdAt: Date;
  userSubscription: UserSubscription[];
  subscriptionHistory: SubscriptionHistory[];

  constructor(
    id: number,
    title: string,
    isRead: boolean,
    createdAt: Date,
    userSubscription: UserSubscription[] = [],
    subscriptionHistory: SubscriptionHistory[] = [],
  ) {
    this.id = id;
    this.title = title;
    this.isRead = isRead;
    this.createdAt = createdAt;
    this.userSubscription = userSubscription;
    this.subscriptionHistory = subscriptionHistory;
  }
}

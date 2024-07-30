import { UserSubscription } from 'src/user/entities/user-subscription.entity';

export class NotificationVo {
  id: number;
  title: string;
  isRead: boolean;
  userSubscription: UserSubscription[];

  constructor(
    id: number,
    title: string,
    isRead: boolean,
    userSubscription: UserSubscription[] = [],
  ) {
    this.id = id;
    this.title = title;
    this.isRead = isRead;
    this.userSubscription = userSubscription;
  }
}

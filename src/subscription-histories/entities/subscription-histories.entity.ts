import { UserSubscriptions } from 'src/user-subscriptions/entities/user-subscription.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SubscriptionHistories {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  userSubscriptionId: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToOne(
    () => UserSubscriptions,
    (userSubscription) => userSubscription.subscriptionHistory,
  )
  @JoinColumn({ name: 'user_subscription_id' })
  userSubscription: UserSubscriptions;
}

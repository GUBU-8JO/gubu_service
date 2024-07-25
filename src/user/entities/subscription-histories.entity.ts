import { UserSubscriptions } from 'src/user/entities/user-subscription.entity';
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
  startedDate: Date;

  @Column()
  paymentMethod: string;

  @Column({type:'int'})
  period: number;

  @Column()
  accountId: string;

  @Column()
  accountPw: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  deletedAt: Date;

  @OneToOne(
    () => UserSubscriptions,
    (userSubscription) => userSubscription.subscriptionHistory,
  )
  @JoinColumn({ name: 'user_subscription_id' })
  userSubscription: UserSubscriptions;
}

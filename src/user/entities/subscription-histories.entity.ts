import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SubscriptionHistory {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  userSubscriptionId: number;

  @Column()
  startedDate: Date;

  @Column()
  nextDate: Date;

  @Column()
  price: number;

  @Column({ nullable: true }) // stopDate를 nullable로 설정하고 null 허용하도록 수정
  stopDate: Date | null;
  @ManyToOne(
    () => UserSubscription,
    (userSubscription) => userSubscription.subscriptionHistory,
  )
  @JoinColumn({ name: 'user_subscription_id' })
  userSubscription: UserSubscription;
}

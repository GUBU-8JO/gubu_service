import { UserSubscriptions } from 'src/user-subscriptions/entities/user-subscription.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  userSubscriptionId: number;

  @Column()
  title: string;

  @Column()
  isRead: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  readedAt: Date;

  @ManyToOne(() => Users, (user) => user.notification, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(
    () => UserSubscriptions,
    (userSubscription) => userSubscription.notification,
  )
  @JoinColumn({ name: 'user_subscription_id' })
  userSubscription: UserSubscriptions;
}

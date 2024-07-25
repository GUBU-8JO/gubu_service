import { Notifications } from 'src/notification/entities/notification.entity';
import { Platforms } from 'src/platform/entities/platforms.entity';
import { SubscriptionHistories } from 'src/user/entities/subscription-histories.entity';
import { Users } from 'src/user/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserSubscriptions {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  platformId: number;

  /**
   * 구독시작일
   * @example "2014-06-18"
   */
  @Column()
  startedDate: Date;

  /**
   * 결제수단
   * @example "신한"
   */
  @Column()
  paymentMethod: string;

  /**
   * 결제주기
   * @example "1"
   */
  @Column({ type: 'int' })
  period: number;

  /**
   * 계정ID
   * @example "example01@exapmple.com"
   */
  @Column()
  accountId: string;

  /**
   * 계정PW
   * @example "!1234ASdf"
   */
  @Column()
  accountPw: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;

  @OneToMany(
    () => SubscriptionHistories,
    (subscriptionHistory) => subscriptionHistory.userSubscription,
  )
  subscriptionHistory: SubscriptionHistories[];

  @OneToMany(
    () => Notifications,
    (notification) => notification.userSubscription,
  )
  notification: Notifications[];

  @ManyToOne(() => Platforms, (platform) => platform.userSubscription)
  @JoinColumn({ name: 'platform_id' })
  platform: Platforms;

  @ManyToOne(() => Users, (user) => user.userSubscription)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}

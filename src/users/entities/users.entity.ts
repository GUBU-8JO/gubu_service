import { Notifications } from 'src/notifications/entities/notification.entity';
import { Reviews } from 'src/reviews/entities/review.entity';
import { UserSubscriptions } from 'src/user-subscriptions/entities/user-subscription.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: Number;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @OneToMany(
    () => UserSubscriptions,
    (userSubscription) => userSubscription.user,
  )
  userSubscription: UserSubscriptions[];

  @OneToMany(() => Reviews, (review) => review.user)
  review: Reviews[];

  @OneToMany(() => Notifications, (notification) => notification.user)
  notification: Notifications[];
}

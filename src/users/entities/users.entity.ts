import { IsNotEmpty } from 'class-validator';
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @Column({ select: false })
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

import { ApiProperty } from '@nestjs/swagger';
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

  /**
   * 닉네임
   * @example "이강산"
   */
  @ApiProperty()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @Column()
  nickname: string;

  /**
   * 이메일
   * @example "example@example.com"
   */
  @ApiProperty()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  @Column()
  email: string;

  /**
   * 비밀번호
   * @example "Example1!"
   */
  @ApiProperty()
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
///

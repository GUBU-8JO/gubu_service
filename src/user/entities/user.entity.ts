import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Notification } from 'src/notification/entities/notification.entity';
import { Review } from 'src/review/entities/review.entity';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
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
    () => UserSubscription,
    (userSubscription) => userSubscription.user,
  )
  userSubscription: UserSubscription[];

  @OneToMany(() => Review, (review) => review.user)
  review: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notification: Notification[];
}
///

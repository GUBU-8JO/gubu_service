import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Notifications } from 'src/notification/entities/notification.entity';
import { Platform } from 'src/platform/entities/platforms.entity';
import { SubscriptionHistories } from 'src/user/entities/subscription-histories.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserSubscriptions {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 1 })
  userId: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 1 })
  platformId: number;

  @Column()
  @ApiProperty({ example: '2014-06-18' })
  @IsString()
  @IsNotEmpty({ message: '구독시작일을 입력해주세요.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: '날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.',
  })
  startedDate: string;

  @Column()
  @ApiProperty({ example: '신한' })
  @IsString()
  @IsNotEmpty({ message: '결제수단을 입력해주세요.' })
  paymentMethod: string;

  @Column({ type: 'int' })
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '결제주기를 입력해주세요.' })
  period: number;

  @Column()
  @ApiProperty({ example: 'example01@exapmple.com' })
  @IsString()
  @IsOptional()
  accountId: string;

  @Column()
  @ApiProperty({ example: '!1234ASdf' })
  @IsString()
  @IsOptional()
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

  @ManyToOne(() => Platform, (platform) => platform.userSubscription)
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;

  @ManyToOne(() => User, (user) => user.userSubscription)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

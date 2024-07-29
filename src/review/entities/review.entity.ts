import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Platform } from '../../platform/entities/platforms.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  platformId: number;

  @Column({ type: 'int' })
  rate: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: number;

  @DeleteDateColumn({ type: 'datetime' })
  DeletedAt: number;

  @OneToOne(() => Platform, (platform) => platform.review)
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;

  @ManyToOne(() => User, (user) => user.review)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

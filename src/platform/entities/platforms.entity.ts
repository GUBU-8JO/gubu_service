import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSubscription } from 'src/user/entities/user-subscription.entity';
import { Review } from 'src/review/entities/review.entity';

@Entity()
export class Platform {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  categoryId: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  purchaseLink: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  period: number;

  @Column({ type: 'int', nullable: true })
  rating?: number;

  @OneToMany(
    () => UserSubscription,
    (userSubscription) => userSubscription.platform,
  )
  userSubscription: UserSubscription[];

  @OneToMany(() => Review, (review) => review.platform)
  review: Review[];

  @ManyToOne(() => Category, (category) => category.platform, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

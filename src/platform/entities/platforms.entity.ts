import { Category } from '../../category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSubscriptions } from 'src/user/entities/user-subscription.entity';
import { Reviews } from 'src/review/entities/review.entity';

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

  @OneToMany(
    () => UserSubscriptions,
    (userSubscription) => userSubscription.platform,
  )
  userSubscription: UserSubscriptions[];

  @OneToOne(() => Reviews, (review) => review.platform)
  review: Reviews;

  @ManyToOne(() => Category, (category) => category.platforms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

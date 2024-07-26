import { Categories } from 'src/categorie/entities/category.entity';
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
export class Platforms {
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

  @ManyToOne(() => Categories, (category) => category.platform, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Categories;
}

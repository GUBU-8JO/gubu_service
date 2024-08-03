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
  @PrimaryGeneratedColumn({ type: 'int', comment: '플랫폼 id' })
  id: number;

  @Column({ type: 'int', comment: '플랫폼이 속한 카테고리 id' })
  categoryId: number;

  @Column({ comment: '플랫폼 이름' })
  title: string;

  @Column({ comment: '플랫폼 이미지' })
  image: string;

  @Column({ comment: '추가정보를 위한 페이지 링크' })
  purchaseLink: string;

  @Column({ type: 'int', comment: '플랫폼 구독 가격' })
  price: number;

  @Column({ type: 'int', comment: '플랫폼 구독 주기' })
  period: number;

  @Column({ type: 'int', nullable: true, comment: '플랫폼의 평점' })
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

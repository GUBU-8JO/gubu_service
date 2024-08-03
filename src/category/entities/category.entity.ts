import { Platform } from 'src/platform/entities/platforms.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', comment: ' 카테고리 id' })
  id: number;

  @Column({ type: 'varchar', comment: '카테고리 이름' })
  category: string;

  @OneToMany(() => Platform, (platform) => platform.category)
  platform: Platform[];
}

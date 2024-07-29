import { Platform } from 'src/platform/entities/platforms.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  category: string;

  @OneToMany(() => Platform, (platform) => platform.category)
  platform: Platform[];
}

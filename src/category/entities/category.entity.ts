import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Platform } from '../../platform/entities/platforms.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @OneToMany(() => Platform, (platform) => platform.category)
  platforms: Platform[];
}

//

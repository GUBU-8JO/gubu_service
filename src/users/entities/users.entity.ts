import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Users {
  @PrimaryGeneratedColumn({type:"int"})
  userId: Number

  @Column()
  nickname: string

  @Column()
  email: string

  @Column()
  password: string

  @CreateDateColumn({type:"datetime"})
  createdAt: Date

  @UpdateDateColumn({type:"datetime"})
  updatedAt: Date
}
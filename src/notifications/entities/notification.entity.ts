import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn({type:"int"})
  notificationId:number

  @Column({type:"int"})
  userId:number

  @Column({type:"int"})
  userSubscriptionId:number

  @Column()
  title:string

  @Column()
  isRead:boolean

  @CreateDateColumn({type:"datetime"})
  createdAt:Date

  @UpdateDateColumn({type:"datetime"})
  readedAt:Date
}

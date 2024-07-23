import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserSubscription {
  @PrimaryGeneratedColumn({type:"int"})
  userSubscriptionsId: number
  
  @Column({type:"int"})
  userId: number

  @Column({type:"int"})
  serviceId: number

  @Column()
  startedDate: Date

  @Column({type:"int"})
  period: number

  @Column()
  price: number

  @Column()
  paymentMethod: string

  @Column()
  nextPaymentDate: Date

  @Column()
  finalPaymentDate: Date

  @Column()
  accountId: string

  @Column()
  accountPw: string

  @CreateDateColumn({type:"datetime"})
  createdAt: Date

  @UpdateDateColumn({type:"datetime"})
  updatedAt: Date

  @DeleteDateColumn({type:"datetime"})
  deletedAt: Date
}

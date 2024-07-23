import { Notifications } from "src/notifications/entities/notification.entity";
import { Services } from "src/services/entities/service.entity";
import { SubscriptionHistories } from "src/subscription-histories/entities/subscription-histories.entity";
import { Users } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserSubscriptions {
  @PrimaryGeneratedColumn({type:"int"})
  id: number
  
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

  @OneToOne(()=> SubscriptionHistories, (subscriptionHistory) => subscriptionHistory.userSubscription)
  subscriptionHistory: SubscriptionHistories

  @OneToMany(()=> Notifications, (notification)=> notification.userSubscription)
  notification:Notifications[]

  @ManyToOne(()=>Services, (service)=>service.userSubscription)
  @JoinColumn({name:"service_id"})
  service:Services

  @ManyToOne(()=>Users, (user)=>user.userSubscription)
  @JoinColumn({name:"user_id"})
  user:Users
}

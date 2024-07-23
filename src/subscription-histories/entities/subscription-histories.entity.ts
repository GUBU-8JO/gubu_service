import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SubscriptionHistories {
  @PrimaryGeneratedColumn({type:"int"})
  subscriptionHistoriesId:number

  @Column({type:"int"})
  userSubscriptionId: number

  @Column()
  startDate: Date

  @Column()
  endDate: Date
}
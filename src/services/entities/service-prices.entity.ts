import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ServicePrice {
  @PrimaryGeneratedColumn()
  servicePriceId:number

  @Column()
  serviceId:number

  @Column()
  period:string

  @Column()
  price:string

  @DeleteDateColumn()
  deletedAt: Date
}
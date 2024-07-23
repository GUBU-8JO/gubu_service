import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Services } from "./service.entity";

@Entity()
export class ServicePrices {
  @PrimaryGeneratedColumn()
  id:number

  @Column()
  serviceId:number

  @Column()
  period:string

  @Column()
  price:string

  @DeleteDateColumn()
  deletedAt: Date

  @OneToOne(()=> Services , (service)=>service.servicePrice)
  @JoinColumn({name:"service_id"})
  service:Services
}
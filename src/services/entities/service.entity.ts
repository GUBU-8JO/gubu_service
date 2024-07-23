import { Categories } from "src/categories/entities/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ServicePrices } from "./service-prices.entity";
import { UserSubscriptions } from "src/user-subscriptions/entities/user-subscription.entity";
import { Reviews } from "src/reviews/entities/review.entity";

@Entity()
export class Services {
  @PrimaryGeneratedColumn({type:"int"})
  id:number

  @Column({type:"int"})
  categoryId:number

  @Column()
  title:string

  @Column()
  image:string

  @OneToMany(()=> UserSubscriptions, (userSubscription)=> userSubscription.service)
  userSubscription: UserSubscriptions

  @OneToOne(()=> ServicePrices, (servicePrice) => servicePrice.service)
  servicePrice:ServicePrices

  @OneToOne(()=> Reviews, (review) => review.service)
  review:Reviews

  @ManyToOne(()=> Categories, (category)=>category.service, {onDelete:"CASCADE"})
  @JoinColumn({name:"category_id"})
  category:Categories
}

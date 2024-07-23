import { Category } from "src/categories/entities/category.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Service {
  @PrimaryGeneratedColumn({type:"int"})
  serviceId:number

  @Column({type:"int"})
  categoryId:number

  @Column()
  title:string

  @Column()
  image:string

  // @ManyToOne(()=> Category, (category)=>category.service, {onDelete:"CASCADE"})
  // category:Category
}

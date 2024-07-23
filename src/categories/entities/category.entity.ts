import { Service } from "src/services/entities/service.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Category {
  @PrimaryGeneratedColumn({type:"int"})
  categoryId:number

  @Column({type:"varchar"})
  category:string

  // @OneToMany(()=> Service, (service) => service.category)
  // service: Service
}

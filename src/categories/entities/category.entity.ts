import { Services } from "src/services/entities/service.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Categories {
  @PrimaryGeneratedColumn({type:"int"})
  id:number

  @Column({type:"varchar"})
  category:string

  @OneToMany(()=> Services, (service) => service.category)
  service: Services[]
}

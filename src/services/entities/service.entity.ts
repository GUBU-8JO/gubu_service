import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}

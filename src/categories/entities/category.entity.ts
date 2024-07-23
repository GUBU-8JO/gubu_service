import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Category {
  @PrimaryGeneratedColumn({type:"int"})
  categoryId:number

  @Column({type:"varchar"})
  category:string
}

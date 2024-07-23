import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Review {
  @PrimaryGeneratedColumn({type:"int"})
  reviewId:number

  @Column({type:"int"})
  userId:number

  @Column({type:"int"})
  serviceId:number

  @Column({type:"int"})
  rate:number

  @Column({type:"text"})
  comment:string

  @CreateDateColumn({type:"datetime"})
  createdAt:number

  @DeleteDateColumn({type:"datetime"})
  DeletedAt:number

}

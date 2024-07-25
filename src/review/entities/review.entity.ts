import { Services } from "src/platform/entities/service.entity";
import { Users } from "src/user/entities/users.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Reviews {
  @PrimaryGeneratedColumn({type:"int"})
  id:number

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

  @OneToOne(()=> Services, (service) => service.review)
  @JoinColumn({name:"service_id"})
  service:Services

  @ManyToOne(()=>Users, (user)=> user.review)
  @JoinColumn({name:"user_id"})
  user:Users
}

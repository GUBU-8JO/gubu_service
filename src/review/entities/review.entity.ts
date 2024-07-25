import {Users} from "src/user/entities/users.entity";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Platforms} from "../../platform/entities/platforms.entity";

@Entity()
export class Reviews {
    @PrimaryGeneratedColumn({type: "int"})
    id: number

    @Column({type: "int"})
    userId: number

    @Column({type: "int"})
    platformId: number

    @Column({type: "int"})
    rate: number

    @Column({type: "text"})
    comment: string

    @CreateDateColumn({type: "datetime"})
    createdAt: number

    @DeleteDateColumn({type: "datetime"})
    DeletedAt: number

    @OneToOne(() => Platforms, (platform) => platform.review)
    @JoinColumn({name: "platform_id"})
    platform: Platforms

    @ManyToOne(() => Users, (user) => user.review)
    @JoinColumn({name: "user_id"})
    user: Users
}

import {Notifications} from 'src/notification/entities/notification.entity';
import {Platforms} from 'src/platform/entities/platforms.entity';
import {SubscriptionHistories} from 'src/user/entities/subscription-histories.entity';
import {Users} from 'src/user/entities/users.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserSubscriptions {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'int'})
    userId: number;

    @Column({type: 'int'})
    platformId: number;

    @Column()
    startedDate: Date;

    @Column({type: 'int'})
    period: number;

    @Column()
    price: number;

    @Column()
    paymentMethod: string;

    @Column()
    nextPaymentDate: Date;

    @Column()
    finalPaymentDate: Date;

    @Column()
    accountId: string;

    @Column()
    accountPw: string;

    @CreateDateColumn({type: 'datetime'})
    createdAt: Date;

    @UpdateDateColumn({type: 'datetime'})
    updatedAt: Date;

    @DeleteDateColumn({type: 'datetime'})
    deletedAt: Date;

    @OneToOne(
        () => SubscriptionHistories,
        (subscriptionHistory) => subscriptionHistory.userSubscription,
    )
    subscriptionHistory: SubscriptionHistories;

    @OneToMany(
        () => Notifications,
        (notification) => notification.userSubscription,
    )
    notification: Notifications[];

    @ManyToOne(() => Platforms, (platform) => platform.userSubscription)
    @JoinColumn({name: 'platform_id'})
    platform: Platforms

    @ManyToOne(() => Users, (user) => user.userSubscription)
    @JoinColumn({name: 'user_id'})
    user: Users
}

import { Exclude } from 'class-transformer';
import { User } from '../entities/user.entity';

export class UserMeVo {
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  id: number;

  nickname: string;

  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

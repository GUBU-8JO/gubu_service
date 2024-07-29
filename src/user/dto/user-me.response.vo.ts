import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UserMeVo {
  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdAt: Date;

  @IsNumber()
  id: number;

  @IsString()
  nickname: string;

  @IsEmail()
  email: string;

  // @Exclude()
  // @UpdateDateColumn({ type: 'datetime', select: false })
  // updatedAt: Date;

  // constructor(id: number, nickname: string, email: string, updatedAt: Date) {
  //   this.id = id;
  //   this.nickname = nickname;
  //   this.email = email;
  //   this.updatedAt = this.updatedAt;
  // }
  constructor(partial: Partial<UserMeVo>) {
    Object.assign(this, partial);
  }
}

import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserMeVo {
  @IsNumber()
  id: number;

  @IsString()
  nickname: string;

  @IsEmail()
  email: string;

  constructor(id: number, nickname: string, email: string) {
    this.id = id;
    this.nickname = nickname;
    this.email = email;
  }
}

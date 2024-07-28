import { IsEmail, IsNumber } from 'class-validator';

export class SignUpDataVo {
  @IsNumber()
  id: number;

  @IsEmail()
  email: string;

  constructor(id: number, email: string) {
    this.id = id;
    this.email = email;
  }
}

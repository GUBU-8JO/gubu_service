import { IsEmail, IsNumber } from 'class-validator';
//로그인
// export class SignInDataVo {
//   data: string;

//   constructor(data: string) {
//     this.data = data;
//   }
// }
//회원가입
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

import { IsString } from 'class-validator';

//로그인
export class SignInDataVo {
  @IsString()
  data: string;

  constructor(data: string) {
    this.data = data;
  }
}

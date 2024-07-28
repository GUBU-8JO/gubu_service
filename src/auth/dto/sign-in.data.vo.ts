import { IsString } from 'class-validator';

//로그인
export class SignInDataVo {
  @IsString()
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}

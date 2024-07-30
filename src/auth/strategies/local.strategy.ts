import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
//PassportStrategy 중에서 passport-local 패키지에서 제공하는 Strategy 사용
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      //이메일과 비밀번호 가져와서
      usernameField: 'email',
      //+ passwordField 요거는 안써도 됨
      passwordField: 'password',
    });
  }
  //이메일과 비밀번호 인증
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException('일치하는 회원이 없습니다.');
    }
    return user;
  }
}

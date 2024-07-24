import {
  Controller,
  Post,
  Body,
  HttpStatus,

  // Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '회원가입에 성공했습니다.',
      data,
    };
  }
  @Post('/sign-in')
  async signIn(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signIn(signUpDto);
    return {
      statusCode: HttpStatus.OK,
      message: '로그인에 성공했습니다.',
      data,
    };
  }

  // @Post('/sign-out')
  // signOut(){
  //   return {message: '로그아웃에 성공하였습니다.'}
  // }
  //로그아웃 어떻게 할건지
  //회원탈퇴
}

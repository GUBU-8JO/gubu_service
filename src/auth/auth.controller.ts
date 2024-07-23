import {
  Controller,
  Post,
  Body,

  // Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return { message: '회원가입에 성공했습니다.' };
  }
  @Post('/sign-in')
  signIn(@Body() signUpDto: SignUpDto) {
    return { message: '로그인에 성공했습니다.' };
  }

  //로그아웃 어떻게 할건지
  //회원탈퇴
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}

import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,

  // Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'src/auth/decorators/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   * @param signUpDto
   * @returns
   */
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '회원가입에 성공했습니다.',
      data,
    };
  }
  /**
   * 로그인
   * @param signInDto
   * @returns
   */
  @UseGuards(AuthGuard('local'))
  @Post('/sign-in')
  async signIn(@userInfo() user: User, @Body() signInDto: SignInDto) {
    const data = await this.authService.signIn(signInDto);
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
  //로그아웃, 회원탈퇴 어떻게 할건지
}

import {
  Controller,
  Post,
  Body,
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
import { ResponseDto } from 'src/common/response.dto';
import { SignUpDataVo } from 'src/auth/dto/sign-up.data.vo';
import { SignInDataVo } from 'src/auth/dto/sign-in.data.vo';

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
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<ResponseDto<SignUpDataVo>> {
    const data = await this.authService.signUp(signUpDto);
    console.log(typeof data);
    return new ResponseDto(data);
  }

  /**
   * 로그인
   * @param signInDto
   * @returns
   */
  @UseGuards(AuthGuard('local'))
  @Post('/sign-in')
  async signIn(
    @userInfo() user: User,
    @Body() signInDto: SignInDto,
  ): Promise<ResponseDto<SignInDataVo>> {
    const data = await this.authService.signIn(signInDto);
    const signInData = new SignInDataVo(data);
    console.log(typeof data);
    console.log(typeof signInData);
    return new ResponseDto(signInData);
  }
}
//로그아웃, 회원탈퇴 어떻게 할건지

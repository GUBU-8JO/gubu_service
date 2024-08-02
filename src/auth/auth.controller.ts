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
// tutor: 제거
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
  async signUp(@Body() signUpDto: SignUpDto): Promise<ResponseDto> {
    // const data =
    await this.authService.signUp(signUpDto);
    return new ResponseDto();
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

    return new ResponseDto(data);
  }
}

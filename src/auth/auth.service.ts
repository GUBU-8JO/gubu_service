import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  signUp(signUpDto: SignUpDto) {
    return 'This action adds a new auth';
  }
  signIn(signInDto: SignInDto) {
    return 'This action adds a new auth';
  }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}

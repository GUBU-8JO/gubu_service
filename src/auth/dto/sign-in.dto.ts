import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';

export class SignInDto extends PickType(User, ['email', 'password']) {
  /**
   * 이메일입력
   * @example "example@example.com"
   */
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  /**
   * 비밀번호
   * @example "Example1!"
   */
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}

import { PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class SignUpDto extends PickType(User, [
  'email',
  'nickname',
  'password',
]) {
  /**
   * 이메일입력
   * @example "example@example.com"
   */
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @IsEmail({}, { message: '이메일형식이 올바르지 않습니다.' })
  email: string;

  /**
   * 닉네임
   * @example "이강산"
   */
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickname: string;

  /**
   * 비밀번호
   * @example "Example1!"
   */
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자 이하이어야 합니다.' })
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message: '비밀번호는 적어도 하나의 특수문자를 포함해야 합니다.',
  })
  password: string;

  /**
   * 비밀번호확인
   * @example "Example1!"
   */
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  @MinLength(8, { message: '비밀번호확인은 최소 8자 이상이어야 합니다.' })
  @MaxLength(20, { message: '비밀번호확인은 최대 20자 이하이어야 합니다.' })
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message: '비밀번호확인은 적어도 하나의 특수문자를 포함해야 합니다.',
  })
  rePassword: string;
}

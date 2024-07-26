import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

// export class SignUpDto extends PickType(Users, ['email', 'password'])
export class SignUpDto extends PickType(User, [
  'email',
  'nickname',
  'password',
]) {
  /**
   * 비밀번호확인
   * @example "Example1!"
   */
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  rePassword: string;
}
//

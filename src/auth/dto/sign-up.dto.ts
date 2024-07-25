import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { Users } from 'src/users/entities/users.entity';

// export class SignUpDto extends PickType(Users, ['email', 'password'])
export class SignUpDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
]) {
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  rePassword: string;
}
//

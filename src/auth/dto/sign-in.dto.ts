import { PickType } from '@nestjs/mapped-types';
import { Users } from 'src/users/entities/users.entity';

export class SignInDto extends PickType(Users, ['email', 'password']) {}

import { IsNumber, IsEmail } from 'class-validator';

export class SearchUserDto {
  @IsNumber()
  id?: number;

  @IsEmail()
  email: string;
}

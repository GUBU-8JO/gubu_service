import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  findMe(@Req() req: number) {
    return { message: '정보조회에 성공하셨습니다.' };
  }
}
//회원탈퇴 할지말지 고민중
// @Delete('/me')
// remove(@Req()){
//     return "삭제완료"
//  };

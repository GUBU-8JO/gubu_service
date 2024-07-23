import { Controller, Delete, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get('/me')
  findMe(@Req() req:number ){
    return {message: "정보조회에 성공하셨습니다."}
  }
}
// @Get('/me')
// findMe(@Req()){
//     return "내정보조회"
// };

// @Delete('/me')
// remove(@Req()){
//     return "삭제완료"
//  };

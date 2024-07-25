import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('사용자')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 내 정보조회
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findMe(@Req() req) {
    const userId = req.user.id;
    const data = await this.usersService.findById(userId);
    return {
      statuscode: HttpStatus.OK,
      message: '정보조회에 성공하셨습니다.',
      data,
    };
  }
}
//회원탈퇴 할지말지 고민중
// @Delete('/me')
// remove(@Req()){
//     return "삭제완료"
//  };

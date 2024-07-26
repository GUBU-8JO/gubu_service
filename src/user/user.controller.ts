import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('사용자')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    const data = await this.userService.findById(userId);
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

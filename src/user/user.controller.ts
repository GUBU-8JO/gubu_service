import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { userInfo } from 'src/auth/decorators/userInfo.decorator';
import { User } from './entities/user.entity';
import { ResponseDto } from 'src/common/response.dto';
import { UserMeVo } from './dto/user-me.response.vo';

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
  async findMe(@userInfo() user: User): Promise<ResponseDto<UserMeVo>> {
    const userId = user.id;
    const data = await this.userService.findById(userId);
    return new ResponseDto(data);
  }
}
//회원탈퇴 할지말지 고민중
// @Delete('/me')
// remove(@Req()){
//     return "삭제완료"
//  };

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserMeVo } from './dto/user-me.response.vo';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  //사용자정보조회
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  //사용자정보조회 id로 할 때
  async findById(id: number): Promise<UserMeVo> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }
}

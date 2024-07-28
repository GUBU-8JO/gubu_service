import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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

  //사용자정보조회 id
  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }
}
//findOne 할 때 엔티티에 select :false안하면 내 정보조회에서 나옴
// 내 정보조회는 findOne 결과값이고
//회원가입에는 findOne결과가 아닌, 저장된 정보를 보여주는 건데 그 정보는 이메일, 닉네임, 패스워드 이고,
//아래에 딜리트를 적용시켜야 안나옴.
//=> select :false findOne했을 때 안보이게 해주는 용도.
// 딜리트는 이미 저장 후 한 것이므로 디비에는 저장 되고 보여줄 때 안보이게 해주는것...
//auth서비스에서 회원가입.....

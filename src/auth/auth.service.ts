import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/user/entities/users.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    // private readonly jwtService: JwtService,
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}
  async signUp({ email, nickname, password, rePassword }: SignUpDto) {
    const passwordMathed = password === rePassword;
    if (!passwordMathed) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const existedUser = await this.userRepository.findOneBy({ email });
    if (existedUser) {
      throw new BadRequestException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    const hashRounds = this.configService.get<number>('HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);

    const user = await this.userRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
    console.log(password);
    delete user.password;
    return user;
  }
  signIn(signInDto: SignInDto) {
    return 'This action adds a new auth';
  }

  //async validateUser({email, password}: singInDto)
  //findOnBy 사용시 select옵션을 사용할 수 없으므로, 엔티티에 안가져오기로 했던 비밀번호를 가져올 수 없음
  //const user = await this.userRepository.findOne({where:{email}, select:{id:true, password:true},});
  //const passwordMatched = bcrypt.compareSync(password, user?.password ?? '')
  //if(!user || !passwordMathed ){
  // return null}

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}

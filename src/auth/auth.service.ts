import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import bcrypt from 'bcrypt';
import { SignInDataVo } from './dto/sign-in.data.vo';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async signUp({
    email,
    nickname,
    password,
    rePassword,
  }: SignUpDto): Promise<void> {
    const passwordMatched = password === rePassword;
    if (!passwordMatched) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    // tutor : 이미 존재 하는지 함수 별도 생성 후 호출
    const existedUser = await this.userRepository.findOneBy({ email });
    if (existedUser) {
      throw new BadRequestException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }
    try {
      // tutor : 비밀번호 암호화 함수 별도 분리해서 호출
      const hashRounds = this.configService.get<number>('HASH_ROUNDS');
      const hashedPassword = bcrypt.hashSync(password, hashRounds);

      await this.userRepository.save({
        email,
        nickname,
        password: hashedPassword,
      });
    } catch (err) {
      throw new InternalServerErrorException('회원가입에 실패했습니다.');
    }
  }

  async signIn(signInDto: SignInDto): Promise<SignInDataVo> {
    const { email } = signInDto;
    // tutor: authGuard 로 로그인 시켰다면 굳이 여기서 한번더 사용자 조회를 할필요가 있나요?
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
  //디비에 있는 사용자 확인
  async validateUser({ email, password }: SignInDto) {
    //findOnBy 사용시 select옵션을 사용할 수 없으므로, 엔티티에 안가져오기로 했던 비밀번호를 가져올 수 없음
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true, email: true },
    });
    const passwordMatched = bcrypt.compareSync(password, user?.password ?? '');
    if (!user || !passwordMatched) {
      return null;
    }
    //jwt 할 때 필요
    return { id: user.id };
  }
}

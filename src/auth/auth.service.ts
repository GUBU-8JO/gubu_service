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

  private async checkUserExist(email: string) {
    const existUser = await this.userRepository.findOneBy({ email });
    if (existUser) {
      throw new BadRequestException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }
  }

  private async encryptPassword(password: string) {
    const hashRounds = this.configService.get<number>('HASH_ROUNDS');
    return bcrypt.hashSync(password, hashRounds);
  }

  async signUp({
    email,
    nickname,
    password,
    rePassword,
  }: SignUpDto): Promise<void> {
    // const passwordMatched = ;
    if (password !== rePassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
    await this.checkUserExist(email);

    try {
      const hashedPassword = await this.encryptPassword(password);

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

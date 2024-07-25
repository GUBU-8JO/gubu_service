import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}
  async signUp({ email, nickname, password, rePassword }: SignUpDto) {
    const passwordMatched = password === rePassword;
    if (!passwordMatched) {
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
    delete user.password;
    return user;
  }
  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password'],
    });
    //아직안함 : 정보가 맞는지 조회

    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async validateUser({ email, password }: SignInDto) {
    //findOnBy 사용시 select옵션을 사용할 수 없으므로, 엔티티에 안가져오기로 했던 비밀번호를 가져올 수 없음
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    const passwordMatched = bcrypt.compareSync(password, user?.password ?? '');
    if (!user || !passwordMatched) {
      return null;
    }
    //jwt 할 때 필요
    return { id: user.id };
  }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}

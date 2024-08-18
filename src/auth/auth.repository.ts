import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private async encryptPassword(password: string) {
    const hashRounds = this.configService.get<number>('HASH_ROUNDS');
    return bcrypt.hashSync(password, hashRounds);
  }

  async findUserByEmail(email: string) {
    const user = await this.repository.findOneBy({ email });
    return user;
  }

  async findUser(email: string) {
    const user = await this.repository.findOne({
      where: { email },
      select: { id: true, password: true, email: true },
    });
    return user;
  }

  async saveUser(email: string, nickname: string, password: string) {
    const hashedPassword = await this.encryptPassword(password);
    const user = await this.repository.save({
      email,
      nickname,
      password: hashedPassword,
    });
    return user;
  }
}

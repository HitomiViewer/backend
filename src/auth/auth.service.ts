import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUser(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async getUserWithValidateToken(id: string, token: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;
    if (user.refreshToken !== token) return null;
    return user;
  }

  async generateAccessToken(user: Express.User) {
    return this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
      },
    );
  }

  async generateRefreshToken(user: Express.User) {
    const token = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      },
    );

    await this.userRepository.update(user.id, { refreshToken: token });

    return token;
  }

  async removeRefreshToken(user: Express.User) {
    return await this.userRepository.update(user.id, {
      refreshToken: undefined,
    });
  }

  async validateUser(id: string, password: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async signup(
    user: Pick<UserEntity, 'id' | 'password'> & Partial<UserEntity>,
  ) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    const newUser = await this.userRepository.save(
      this.userRepository.create({
        ...user,
        password: hashedPassword,
        salt,
      }),
    );
    return newUser;
  }
}

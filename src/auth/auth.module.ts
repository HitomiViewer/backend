import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { LogEntity } from 'src/log/log.entity';
import { AccessStrategy } from './strategies/access.strategy';
import { LoginStrategy } from './strategies/login.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secretOrPrivateKey: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('ACCESS_TOKEN_EXPIRES_IN') },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, LogEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessStrategy, LoginStrategy, RefreshStrategy],
})
export class AuthModule {}

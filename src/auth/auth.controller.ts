import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiTags,
} from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { LoginGuard } from './guards/login.guard';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AccessGuard } from './guards/access.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { REFRESH_TOKEN_KEY, REFRESH_TOKEN_OPTION } from 'src/util';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity, LogType } from 'src/log/log.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  hello(@Req() req: Request) {
    if (!req.user) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.authService.getUser(req.user.id);
  }

  @Post(['/', '/signin'])
  @ApiBody({
    type: SignInDto,
  })
  @UseGuards(LoginGuard)
  async signin(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const refreshToken = await this.authService.generateRefreshToken(req.user);
    // const frontendUrl = this.config.get<string>('FRONTEND_URL');

    // if (!frontendUrl) {
    //   throw new Error('FRONTEND_URL is not setted');
    // }

    await this.logRepository.insert(
      this.logRepository.create({
        ip: req.ip,
        type: LogType.LOGIN,
        user: req.user,
      }),
    );

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, REFRESH_TOKEN_OPTION());
    res.send(await this.authService.generateAccessToken(req.user));
  }

  @Post('/signin/app')
  @ApiBody({
    type: SignInDto,
  })
  @UseGuards(LoginGuard)
  async signinApp(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const refreshToken = await this.authService.generateRefreshToken(req.user);
    await this.logRepository.insert(
      this.logRepository.create({
        ip: req.ip,
        type: LogType.LOGIN,
        user: req.user,
      }),
    );

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, REFRESH_TOKEN_OPTION());
    res.send({
      accessToken: await this.authService.generateAccessToken(req.user),
      refreshToken,
    });
  }

  @Post('/signup')
  async signup(@Body() dto: SignUpDto, @Res() res: Response) {
    const user = await this.authService.signup(dto);
    const refreshToken = await this.authService.generateRefreshToken(user);
    // const frontendUrl = this.config.get<string>('FRONTEND_URL');

    // if (!frontendUrl) {
    //   throw new Error('FRONTEND_URL is not setted');
    // }

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, REFRESH_TOKEN_OPTION());
    res.send(await this.authService.generateAccessToken(user));
  }

  @Post('/signup/app')
  async signupApp(@Body() dto: SignUpDto, @Res() res: Response) {
    const user = await this.authService.signup(dto);
    const refreshToken = await this.authService.generateRefreshToken(user);

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, REFRESH_TOKEN_OPTION());
    res.send({
      accessToken: await this.authService.generateAccessToken(user),
      refreshToken,
    });
  }

  @Get('/logout')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    if (!req.user) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const user = req.user;
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];
    if (!refreshToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    await this.authService.removeRefreshToken(user);
    res.clearCookie(REFRESH_TOKEN_KEY);
    res.send('ok');
  }

  @Get('/refresh')
  @ApiCookieAuth()
  @UseGuards(RefreshGuard)
  async refresh(@Req() req: Request) {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return await this.authService.generateAccessToken(req.user);
  }
}

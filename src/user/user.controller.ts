import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
@ApiBearerAuth()
@UseGuards(AccessGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('favorite')
  async getFavorites(@Req() req: Request) {
    if (req.user?.id === undefined) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.userService.getFavorites(req.user.id);
  }

  @Post('favorite')
  async createFavorite(@Req() req: Request, @Body() body: CreateFavoriteDto) {
    if (req.user?.id === undefined) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.userService.createFavorite(req.user.id, body.favorites);
  }
}

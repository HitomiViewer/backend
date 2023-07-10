import { Controller, Get, Param, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity, LogType } from './log.entity';
import { Request } from 'express';

@Controller('log')
export class LogController {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}
  @Get('/:id')
  async log(@Req() req: Request, @Param('id') id: number) {
    await this.logRepository.insert(
      this.logRepository.create({
        type: LogType.READ,
        ip: req.headers['x-forwarded-for'] as string,
        idHitomi: id,
      }),
    );
  }
}

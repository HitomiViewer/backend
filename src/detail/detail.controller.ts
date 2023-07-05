import { HitomiService } from '@app/hitomi';
import { CacheTTL, Controller, Get, Param, Req } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import ms from 'ms';
import { Detail } from 'src/@types/hitomi';
import { LogEntity } from 'src/log/log.entity';
import { Repository } from 'typeorm';

@Controller('detail')
@CacheTTL(ms('1h'))
@ApiTags('hitomi')
export class DetailController {
  constructor(
    private readonly hitomi: HitomiService,
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'gallery id',
    schema: {
      example: 2373351,
    },
  })
  @ApiOkResponse({
    status: 200,
    description: 'gallery detail',
    type: Detail,
  })
  async getDetail(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<Detail> {
    await this.logRepository.insert(
      this.logRepository.create({ ip: req.ip, idHitomi: id }),
    );
    return await this.hitomi.getGallery(id);
  }
}

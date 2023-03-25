import { HitomiService } from '@app/hitomi';
import { CacheTTL, Controller, Get, Param } from '@nestjs/common';
import ms from 'ms';

@Controller('detail')
@CacheTTL(ms('1h'))
export class DetailController {
  constructor(private readonly hitomi: HitomiService) {}

  @Get('/:id')
  async getDetail(@Param('id') id: number) {
    return await this.hitomi.getGallery(id);
  }
}

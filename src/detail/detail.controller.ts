import { HitomiService } from '@app/hitomi';
import { CacheTTL, Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import ms from 'ms';
import { Detail } from 'src/@types/hitomi';

@Controller('detail')
@CacheTTL(ms('1h'))
@ApiTags('hitomi')
export class DetailController {
  constructor(private readonly hitomi: HitomiService) {}

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
  async getDetail(@Param('id') id: number): Promise<Detail> {
    return await this.hitomi.getGallery(id);
  }
}

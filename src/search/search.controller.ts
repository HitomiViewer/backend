import { HitomiService } from '@app/hitomi';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('search')
@ApiTags('hitomi')
export class SearchController {
  constructor(private readonly hitomi: HitomiService) {}

  @Get(['/', '/ids'])
  @ApiQuery({
    name: 'query',
    type: String,
    required: true,
    description: 'query to search',
    schema: {
      example: 'language:korean tag:full_color',
    },
  })
  @ApiOkResponse({
    status: 200,
    description: 'gallery ids',
    schema: {
      type: 'array',
      items: {
        type: 'number',
      },
      example: [2545347, 2545313, 2545300, 2545225, 2544654],
    },
  })
  async getSearch(@Query('query') query: string) {
    return await this.hitomi.getSearch(query);
  }

  @Get('/suggest')
  @ApiQuery({
    name: 'query',
    type: String,
    required: true,
    description: 'query to get auto-completion',
    schema: {
      example: 'language:',
    },
  })
  @ApiOkResponse({
    status: 200,
    description: 'suggestions',
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
      example: [
        [
          {
            tag: 'nakadashi',
            count: 157222,
            url: '/tag/female:nakadashi-all-1.html',
            ns: 'female',
          },
        ],
      ],
    },
  })
  async getSuggestion(@Query('query') query: string) {
    return await this.hitomi.getSuggestion(query);
  }
}

import { HitomiService } from '@app/hitomi';
import { Controller, Get, HttpException, Query } from '@nestjs/common';
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
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'page number (entire data when not paged)',
    schema: {
      minimum: 1,
      default: 1,
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
  async getSearch(@Query('query') query: string, @Query('page') page?: number) {
    if (page && page < 1)
      throw new HttpException('page must be greater than 0', 400);
    if (!page) return await this.hitomi.getSearch(query);
    return await this.hitomi
      .getSearch(query)
      .then((x) => x.slice((page - 1) * 25, page * 25));
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

import { HitomiService } from '@app/hitomi';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('search')
export class SearchController {
  constructor(private readonly hitomi: HitomiService) {}

  @Get(['/', '/ids'])
  async getSearch(@Query('query') query: string) {
    return await this.hitomi.getSearch(query);
  }

  @Get('/suggest')
  async getSuggestion(@Query('query') query: string) {
    return await this.hitomi.getSuggestion(query);
  }
}

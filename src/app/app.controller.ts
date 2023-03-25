import { HitomiLanguage, HitomiService } from '@app/hitomi';
import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly hitomi: HitomiService) {}

  @Get()
  async getIndex(@Query('page') page?: number): Promise<number[]> {
    if (page && page < 1)
      throw new HttpException('page must be greater than 0', 400);
    return await this.hitomi.getIndexWithPage('all', page);
  }

  @Get('/:language')
  async getIndexWithLanguage(
    @Param('language') language?: HitomiLanguage,
    @Query('page') page?: number,
  ): Promise<number[]> {
    if (page && page < 1)
      throw new HttpException('page must be greater than 0', 400);
    return await this.hitomi.getIndexWithPage(language, page);
  }
}

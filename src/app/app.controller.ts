import { HitomiLanguage, HitomiLanguages, HitomiService } from '@app/hitomi';
import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly hitomi: HitomiService) {}

  @Get()
  async getIndex(
    @Query('page') page?: number,
    @Query('language') language: HitomiLanguage = 'all',
  ): Promise<number[]> {
    if (page && page < 1)
      throw new HttpException('page must be greater than 0', 400);
    if (language !== 'all' && !HitomiLanguages.includes(language as any))
      throw new HttpException('language is not supported', 400);
    if (!page) return await this.hitomi.getIndex(language);
    return await this.hitomi.getIndexWithPage(language, page);
  }
}

import { HitomiLanguage, HitomiLanguages, HitomiService } from '@app/hitomi';
import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('hitomi')
export class AppController {
  constructor(private readonly hitomi: HitomiService) {}

  @Get()
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
  @ApiQuery({
    name: 'language',
    type: String,
    enum: HitomiLanguages,
    required: false,
    description: 'language',
    schema: {
      default: 'all',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'gallery ids',
    schema: {
      type: 'array',
      items: {
        type: 'number',
      },
      example: [2373351, 2373350, 2373349, 2373348, 2373347],
    },
  })
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

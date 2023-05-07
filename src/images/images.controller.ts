import { HitomiService } from '@app/hitomi';
import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller('images')
@ApiTags('hitomi')
export class ImagesController {
  constructor(private readonly hitomi: HitomiService) {}

  @Get('/preview/:hash')
  @ApiParam({
    name: 'hash',
    type: String,
    required: true,
    description: 'image hash',
    schema: {
      pattern: '^[a-f0-9]{64}$',
      example:
        'b07a6a9047817993caec32ffef767080fb41ecc360eab80ca5c1e0a8702aac29',
    },
  })
  @ApiProduces('image/webp')
  @ApiOkResponse({
    status: 200,
    description: 'preview image',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async getPreview(
    @Param('hash') hash: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    res.set({
      'Content-Type': 'image/webp',
    });
    return new StreamableFile(
      Readable.from(await this.hitomi.getPreview(hash, 'webpbigtn')),
    );
  }

  @Get('/avif/:hash')
  @ApiParam({
    name: 'hash',
    type: String,
    required: true,
    description: 'image hash',
    schema: {
      pattern: '^[a-f0-9]{64}$',
      example:
        'b07a6a9047817993caec32ffef767080fb41ecc360eab80ca5c1e0a8702aac29',
    },
  })
  @ApiProduces('image/avif')
  @ApiOkResponse({
    status: 200,
    description: 'preview image',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async getAvif(
    @Param('hash') hash: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    res.set({
      'Content-Type': 'image/avif',
    });
    return new StreamableFile(
      Readable.from(await this.hitomi.getImage(hash, 'avif')),
    );
  }

  @Get('/webp/:hash')
  @ApiParam({
    name: 'hash',
    type: String,
    required: true,
    description: 'image hash',
    schema: {
      pattern: '^[a-f0-9]{64}$',
      example:
        'b07a6a9047817993caec32ffef767080fb41ecc360eab80ca5c1e0a8702aac29',
    },
  })
  @ApiProduces('image/webp')
  @ApiOkResponse({
    status: 200,
    description: 'preview image',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async getWebp(
    @Param('hash') hash: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    res.set({
      'Content-Type': 'image/webp',
    });
    return new StreamableFile(
      Readable.from(await this.hitomi.getImage(hash, 'webp')),
    );
  }
}

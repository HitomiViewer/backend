import { HitomiService } from '@app/hitomi';
import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import sharp from 'sharp';
import { Readable } from 'stream';

@Controller({
  path: 'images',
  version: '2',
})
@ApiTags('hitomi')
export class ImagesControllerV2 {
  constructor(private readonly hitomi: HitomiService) {}

  @Get('/preview/:hash.:type')
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
  @ApiParam({
    name: 'type',
    type: String,
    enum: ['webp', 'avif', 'jpeg'],
    required: false,
    description: 'image type',
    schema: {
      default: 'webp',
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
    @Param('type') type: 'webp' | 'avif' | 'jpeg' = 'webp',
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    console.log(hash, type);
    switch (type) {
      case 'webp':
        res.set({
          'Content-Type': 'image/webp',
        });
        return new StreamableFile(
          Readable.from(await this.hitomi.getPreview(hash, 'webpbigtn')),
        );
      case 'avif':
        res.set({
          'Content-Type': 'image/avif',
        });
        return new StreamableFile(
          Readable.from(await this.hitomi.getPreview(hash, 'avifbigtn')),
        );
      case 'jpeg':
        res.set({
          'Content-Type': 'image/jpeg',
        });
        return new StreamableFile(
          Readable.from(
            await this.hitomi
              .getPreview(hash, 'webpbigtn')
              .then((x) => sharp(x).jpeg().toBuffer()),
          ),
        );
    }
  }

  @Get('/:hash.:type')
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
  @ApiParam({
    name: 'type',
    type: String,
    enum: ['webp', 'avif', 'jpeg'],
    required: false,
    description: 'image type',
    schema: {
      default: 'webp',
    },
  })
  @ApiProduces('image/webp', 'image/avif', 'image/jpeg')
  @ApiOkResponse({
    status: 200,
    description: 'image',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async get(
    @Param('hash') hash: string,
    @Param('type') type: 'webp' | 'avif' | 'jpeg' = 'webp',
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    switch (type) {
      case 'webp':
        res.set({
          'Content-Type': 'image/webp',
        });
        return new StreamableFile(
          Readable.from(await this.hitomi.getImage(hash, 'webp')),
        );
      case 'avif':
        res.set({
          'Content-Type': 'image/avif',
        });
        return new StreamableFile(
          Readable.from(await this.hitomi.getImage(hash, 'avif')),
        );
      case 'jpeg':
        res.set({
          'Content-Type': 'image/jpeg',
        });
        return new StreamableFile(
          Readable.from(
            await this.hitomi
              .getImage(hash, 'webp')
              .then((x) => sharp(x).jpeg().toBuffer()),
          ),
        );
    }
  }
}

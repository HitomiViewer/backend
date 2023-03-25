import { HitomiService } from '@app/hitomi';
import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller('images')
export class ImagesController {
  constructor(private readonly hitomi: HitomiService) {}

  @Get('/preview/:hash')
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

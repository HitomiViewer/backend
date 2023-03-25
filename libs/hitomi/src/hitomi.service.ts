import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { runInNewContext } from 'vm';
import ms from 'ms';

export type HitomiLanguage =
  | [
      'indonesian',
      'javanese',
      'catalan',
      'cebuano',
      'czech',
      'danish',
      'german',
      'estonian',
      'english',
      'spanish',
      'esperanto',
      'french',
      'hindi',
      'icelandic',
      'italian',
      'latin',
      'hungarian',
      'dutch',
      'norwegian',
      'polish',
      'portuguese',
      'romanian',
      'albanian',
      'slovak',
      'serbian',
      'finnish',
      'swedish',
      'tagalog',
      'vietnamese',
      'turkish',
      'greek',
      'bulgarian',
      'mongolian',
      'russian',
      'ukrainian',
      'hebrew',
      'arabic',
      'persian',
      'thai',
      'korean',
      'chinese',
      'japanese',
    ][number]
  | 'all';

@Injectable()
export class HitomiService {
  private readonly logger = new Logger(HitomiService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getIndex(language: HitomiLanguage = 'all', start = 0, end = 25) {
    console.log('start', start * 4, 'end', end * 4 - 1);
    const res = await firstValueFrom(
      this.httpService.get(`https://ltn.hitomi.la/index-${language}.nozomi`, {
        responseType: 'arraybuffer',
        headers: {
          Range: `bytes=${start * 4}-${end * 4 - 1}`,
        },
      }),
    )
      .then((x) => x.data as Buffer)
      .then(this.parseIntArray);

    return res;
  }

  async getIndexWithPage(
    language: HitomiLanguage = 'all',
    page = 1,
    size = 25,
  ) {
    return await this.getIndex(language, (page - 1) * size, page * size);
  }

  async getGallery(id: number) {
    const context: any = {};

    const res = await firstValueFrom(
      this.httpService.get(`https://ltn.hitomi.la/galleries/${id}.js`),
    ).then((x) => (runInNewContext(x.data, context), context.galleryinfo));
    // .then((x) => x.data.substr('var galleryinfo = '.length))
    // .then(JSON.parse);

    return res;
  }

  async getImage(hash: string, type: 'avif' | 'webp') {
    const gg = (await this.cache.get('gg')) || (await this.getGG());
    const path = `${type}/${gg.b}${gg.s(hash)}/${hash}.${type}`;
    const subdomain =
      String.fromCharCode(
        97 +
          gg.m(
            parseInt(
              /(..)(.)$/
                .exec(hash)!
                .splice(1)
                .reverse()
                .reduce((a, b) => a + b, ''),
              16,
            ),
          ),
      ) + 'a';
    return await lastValueFrom(
      this.httpService
        .get(`https://${subdomain}.hitomi.la/${path}`, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            Referer: 'https://hitomi.la/',
          },
        })
        .pipe(map((x) => x.data as Buffer)),
    );
  }

  private parseIntArray(buffer: Buffer) {
    const result = [];
    for (let i = 0; i < buffer.byteLength; i += 4) {
      result.push(buffer.readUInt32BE(i));
    }
    return result;
  }

  private ggEtag = '';
  private async getGG() {
    const context: any = { gg: {} };

    const res = await firstValueFrom(
      this.httpService.get(`https://ltn.hitomi.la/gg.js`),
    ).then(
      (x) => (
        runInNewContext(x.data, context),
        this.cache.set('gg', context.gg, ms('1m')),
        context.gg
      ),
    );

    return res;
  }
}

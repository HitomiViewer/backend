import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { runInNewContext } from 'vm';
import ms from 'ms';
import crypto from 'crypto';

export const HitomiLanguages = [
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
] as const;
export type HitomiLanguage = typeof HitomiLanguages[number] | 'all';

export interface BNode {
  keys: Buffer[];
  datas: BData[];
  subnodes: bigint[];
}

export interface BData {
  offset: bigint;
  length: number;
}

const compressed_nozomi_prefix = 'n';
const domain = 'ltn.hitomi.la';
const max_node_size = 464;
const B = 16;

@Injectable()
export class HitomiService {
  private readonly logger = new Logger(HitomiService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getIndex(language: HitomiLanguage = 'all', start = 0, end = 25) {
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
    const gg = await this.getGG();
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

  async getPreview(
    hash: string,
    type: 'avifbigtn' | 'avifsmallbigtn' | 'webpbigtn',
  ) {
    const gg = await this.getGG();
    const path = `${type}/${hash.replace(/^.*(..)(.)$/, '$2/$1/' + hash)}.${
      { avifbigtn: 'avif', avifsmallbigtn: 'avif', webpbigtn: 'webp' }[type]
    }`;
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
      ) + 'tn';
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

  async getSuggestion(query: string) {
    const field = 'global',
      key = hash(query);
    const node = await this.getNode(field);
    const data = await this.BSearch(field, key, node);
    if (!data) return [];
    const result = await this.getSuggestionWithData(field, data);
    return result;
  }

  async getSearch(query: string) {
    const terms = query
      .split(' ')
      .map((x) => x.replace(/_/g, ' '))
      .map((x) => x.trim());
    const positive = terms.filter((x) => !x.startsWith('-'));
    const negative = terms.filter((x) => x.startsWith('-'));
    let results =
      (positive.length > 0
        ? await this.getIdsWithQuery(positive.pop()!)
        : await this.getIds('index', 'all')) || [];
    await Promise.all(
      negative.map((x) => this.getIdsWithQuery(x).then((x) => x || [])),
    ).then((x) =>
      x
        .filter((x) => x)
        .sort((a, b) => a.length - b.length)
        .map((x) => {
          const set = new Set(x);
          results = results.filter((c) => !set.has(c));
        }),
    );
    await Promise.all(
      positive.map((x) => this.getIdsWithQuery(x).then((x) => x || [])),
    ).then((x) =>
      x
        .sort((a, b) => a.length - b.length)
        .map((x) => {
          if (x.length > results.length) {
            const set = new Set(x);
            results = results.filter((c) => set.has(c));
          } else {
            const set = new Set(results);
            results = x.filter((c) => set.has(c));
          }
        }),
    );
    return results;
  }

  private async getIds(tag: string, lang: string, area?: string) {
    const cached = await this.cache.get<number[]>(
      `ids:${tag}:${lang}:${area || ''}`,
    );
    if (cached) return cached;
    const url = `https://${domain}/${compressed_nozomi_prefix}/${
      area ? `${area}/` : ''
    }${tag}-${lang}.nozomi`;
    const res = await firstValueFrom(
      this.httpService.get(url, {
        responseType: 'arraybuffer',
      }),
    )
      .then((x) => x.data as Buffer)
      .then(this.parseIntArray);

    this.cache.set(`ids:${tag}:${lang}:${area || ''}`, res, ms('1m'));
    return res;
  }

  private async getIdsWithQuery(query: string) {
    const cached = await this.cache.get<number[]>(`ids:${query}`);
    if (cached) return cached;
    query = query.replace(/_/g, ' ');
    if (query.includes(':')) {
      const [ns, tag] = query.split(':');
      if (['female', 'male'].includes(ns)) {
        return await this.getIds(query, 'all', 'tag').then(
          (x) => (this.cache.set(`ids:${query}`, x, ms('1m')), x),
        );
      } else if (ns == 'language') {
        return await this.getIds('index', tag).then(
          (x) => (this.cache.set(`ids:${query}`, x, ms('1m')), x),
        );
      }
      return await this.getIds(tag, 'all', ns).then(
        (x) => (this.cache.set(`ids:${query}`, x, ms('1m')), x),
      );
    }
  }

  private parseIntArray(buffer: Buffer) {
    const result = [];
    for (let i = 0; i < buffer.byteLength; i += 4) {
      result.push(buffer.readUInt32BE(i));
    }
    return result;
  }

  private async getGG() {
    if (await this.cache.get('gg')) {
      return await this.cache.get('gg');
    }

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

  // #region Search

  /**
   * Get root node of field
   * @param field global, galleries, languages, nozomiurl
   * @param address address of node
   * @returns
   */
  private async getNode(
    field: 'global' | 'galleries' | 'languages' | 'nozomiurl',
    address = 0,
  ): Promise<BNode> {
    const cached = await this.cache.get<BNode>(`${field}_${address}`);
    if (cached) return cached;

    const indexDir = {
      global: 'tagindex',
      galleries: 'galleriesindex',
      languages: 'languagesindex',
      nozomiurl: 'nozomiurlindex',
    }[field];
    const indexVersion = await this.getIndexVersion(indexDir);
    const url = `https://${domain}/${indexDir}/${field}.${indexVersion}.index`;

    async function decodeNode(data: Buffer): Promise<BNode> {
      let pos = 0;
      const number_of_keys = data.readUInt32BE(pos);
      pos += 4;
      const keys = [];
      for (let i = 0; i < number_of_keys; i++) {
        const key_length = data.readUInt32BE(pos);
        pos += 4;
        keys.push(data.subarray(pos, pos + key_length));
        pos += key_length;
      }
      const number_of_datas = data.readUInt32BE(pos);
      pos += 4;
      const datas = [];
      for (let i = 0; i < number_of_datas; i++) {
        const offset = data.readBigUint64BE(pos);
        pos += 8;
        const length = data.readUInt32BE(pos);
        pos += 4;
        datas.push({ offset, length });
      }
      const number_of_subnodes = B;
      const subnodes = [];
      for (let i = 0; i <= number_of_subnodes; i++) {
        subnodes.push(data.readBigUint64BE(pos));
        pos += 8;
      }

      return { keys, datas, subnodes };
    }

    const res = await firstValueFrom(
      this.httpService.get(url, {
        responseType: 'arraybuffer',
        headers: {
          Range: `bytes=${address}-${address + max_node_size - 1}`,
        },
      }),
    )
      .then((x) => x.data as Buffer)
      .then(decodeNode);

    return res;
  }

  /**
   * Get suggestion data with data
   * @param field global, galleries, languages, nozomiurl
   * @param data data of node
   * @returns suggestion data
   */
  private async getSuggestionWithData(
    field: 'global' | 'galleries' | 'languages' | 'nozomiurl',
    data: BData,
  ) {
    const indexDir = 'tagindex';
    const indexVersion = await this.getIndexVersion(indexDir);
    const url = `https://${domain}/tagindex/${field}.${indexVersion}.data`;
    const { offset, length } = data;
    if (length > 10000 || length <= 0)
      throw new HttpException(
        `length ${length} is too big or too small`,
        HttpStatus.BAD_REQUEST,
      );

    async function decodeSuggestion(data: Buffer) {
      let pos = 0;
      const suggestions = [];
      const number_of_suggestions = data.readInt32BE(pos);
      pos += 4;
      if (number_of_suggestions > 100 || number_of_suggestions <= 0)
        throw new HttpException(
          `number of suggestions ${number_of_suggestions} is too big or too small`,
          HttpStatus.BAD_REQUEST,
        );

      for (let i = 0; i < number_of_suggestions; i++) {
        let ns = '';
        let top = data.readInt32BE(pos);
        pos += 4;
        for (let j = 0; j < top; j++) {
          ns += String.fromCharCode(data.readUInt8(pos++));
        }

        let tag = '';
        top = data.readInt32BE(pos);
        pos += 4;
        for (let j = 0; j < top; j++) {
          tag += String.fromCharCode(data.readUInt8(pos++));
        }

        const count = data.readInt32BE(pos);
        pos += 4;

        const tagname = tag.replace(/[\/#]/, '');
        let url = `/${ns}/${tagname}-all-1.html`;
        if (ns === 'female' || ns === 'male') {
          url = `/tag/${ns}:${tagname}-all-1.html`;
        } else if (ns === 'language') {
          url = `/index-${tagname}-1.html`;
        }
        suggestions.push({
          tag,
          count,
          url,
          ns,
        });
      }
      return suggestions;
    }

    const res = await firstValueFrom(
      this.httpService.get(url, {
        responseType: 'arraybuffer',
        headers: {
          Range: `bytes=${offset}-${offset + BigInt(length - 1)}`,
        },
      }),
    )
      .then((x) => x.data as Buffer)
      .then(decodeSuggestion);

    return res;
  }

  /**
   * Search B- tree with key
   * @param field global, galleries, languages, nozomiurl
   * @param key key to search
   * @param node node to search
   * @returns data of key
   */
  private async BSearch(
    field: 'global' | 'galleries' | 'languages' | 'nozomiurl',
    key: Buffer,
    node: BNode,
  ): Promise<BData | null> {
    function locateKey(key: Buffer, node: BNode) {
      let cmp_result = -1,
        i;
      for (
        i = 0;
        i < node.keys.length &&
        (cmp_result = Buffer.compare(key, node.keys[i])) > 0;
        i++
      );
      return {
        found: !cmp_result,
        index: i,
      };
    }
    function isLeaf(node: BNode) {
      return !node.subnodes.some((x) => x);
    }
    if (!node.keys.length) {
      return null;
    }

    const { found, index } = locateKey(key, node);
    if (found) return node.datas[index];
    else if (isLeaf(node)) return null;
    else {
      const subnode_address = node.subnodes[index];
      if (!subnode_address) return null;
      const subnode = await this.getNode(field, Number(subnode_address));
      return await this.BSearch(field, key, subnode);
    }
  }

  private async getIndexVersion(name: string) {
    if (await this.cache.get(`${name}_version`)) {
      return await this.cache.get(`${name}_version`);
    }

    return await firstValueFrom(
      this.httpService
        .get(`https://${domain}/${name}/version?_=${Date.now()}`)
        .pipe(map((x) => x.data)),
    );
  }

  // #endregion Search
}

function hash(content: string): Buffer {
  const hash = crypto.createHash('sha256');
  hash.update(content);
  return hash.digest().subarray(0, 4);
}

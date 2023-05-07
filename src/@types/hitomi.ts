import { ApiProperty } from '@nestjs/swagger';

export interface IDetail {
  galleryurl: string;
  id: string;
  language_localname: string;
  video: any;
  characters: any;
  language: string;
  language_url: string;
  scene_indexes: any[];
  tags: Tag[];
  artists: Artist[];
  type: string;
  japanese_title: string | null;
  videofilename: any;
  languages: Language[];
  parodys: Parody[];
  title: string;
  groups: Group[];
  related: number[];
  files: File[];
  date: string;
}

export class Detail implements IDetail {
  @ApiProperty({
    description: 'gallery url',
    example:
      '/cg/ishuukan-shasei-o-gaman-dekitara-nakadashi-sasete-kureru-osananajimi-chan-|-일주일간-사정을-견뎌내면-질내사정-하게-해주는-소꿉친구-한국어-2373351.html',
  })
  galleryurl!: string;

  @ApiProperty({
    description: 'gallery id',
    example: '2373351',
  })
  id!: string;

  @ApiProperty({
    description: 'Language name translated into local language',
    example: '한국어',
  })
  language_localname!: string;

  @ApiProperty({
    description: 'video',
    example: null,
  })
  video: any;

  @ApiProperty({
    description: 'characters',
    example: [
      {
        url: '/character/tokoyami%20towa-all.html',
        character: 'tokoyami towa',
      },
    ],
  })
  characters!: Character[];

  @ApiProperty({
    description: 'language',
    example: 'korean',
  })
  language!: string;

  @ApiProperty({
    description: 'language url',
    example: '/index-korean.html',
  })
  language_url!: string;

  @ApiProperty({
    description: 'scene indexes',
    example: [],
  })
  scene_indexes!: any[];

  @ApiProperty({
    description: 'tags',
    example: [
      {
        tag: 'nakadashi',
        male: '',
        female: '1',
        url: '/tag/female%3Anakadashi-all.html',
      },
    ],
  })
  tags!: Tag[];

  @ApiProperty({
    description: 'artists',
    example: [
      {
        artist: 'torimogura',
        url: '/artist/torimogura-all.html',
      },
    ],
  })
  artists!: Artist[];

  @ApiProperty({
    description: 'type',
    example: 'doujinshi',
  })
  type!: string;

  @ApiProperty({
    description: 'japanese title',
    example: null,
  })
  japanese_title: string | null = null;

  @ApiProperty({
    description: 'video filename',
    example: null,
  })
  videofilename: any;

  @ApiProperty({
    description: 'languages',
    example: [],
  })
  languages!: Language[];

  @ApiProperty({
    description: 'parodys',
    example: [
      {
        url: '/series/hololive-all.html',
        parody: 'hololive',
      },
    ],
  })
  parodys!: Parody[];

  @ApiProperty({
    description: 'title',
    example: '일주일간 사정을 견뎌내면 질내사정 하게 해주는 소꿉친구',
  })
  title!: string;

  @ApiProperty({
    description: 'groups',
    example: [
      {
        url: '/group/crimson-all.html',
        group: 'crimson',
      },
    ],
  })
  groups!: Group[];

  @ApiProperty({
    description: 'related',
    example: [2301686, 2289295, 1904721, 1557323, 2228040],
  })
  related!: number[];

  @ApiProperty({
    description: 'files',
    example: [
      {
        height: 1300,
        haswebp: 1,
        width: 1800,
        name: '001_01_00.png',
        hasavif: 1,
        hash: 'b07a6a9047817993caec32ffef767080fb41ecc360eab80ca5c1e0a8702aac29',
      },
    ],
  })
  files!: File[];

  @ApiProperty({
    description: 'date',
    example: '2022-11-10 08:18:00-06',
  })
  date!: string;
}

export interface Character {
  url: string;
  character: string;
}

export interface Tag {
  female: string;
  url: string;
  male: string;
  tag: string;
}

export interface Artist {
  artist: string;
  url: string;
}

export interface Language {
  galleryid: string;
  language_localname: string;
  name: string;
  url: string;
}

export interface Parody {
  url: string;
  parody: string;
}

export interface Group {
  url: string;
  group: string;
}

export interface File {
  height: number;
  haswebp: number;
  width: number;
  name: string;
  hasavif: number;
  hash: string;
}

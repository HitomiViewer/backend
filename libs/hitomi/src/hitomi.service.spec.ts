import { Test, TestingModule } from '@nestjs/testing';
import { HitomiService } from './hitomi.service';
import { HttpModule } from '@nestjs/axios';

jest.setTimeout(1000 * 10);

describe('HitomiService', () => {
  let service: HitomiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [HitomiService],
    }).compile();

    service = module.get<HitomiService>(HitomiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return data', async () => {
    await service.getIndex('korean').then(console.log);
    await service.getGallery(2503509).then(console.log);
  });
});

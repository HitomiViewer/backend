import { Global, Module } from '@nestjs/common';
import { HitomiService } from './hitomi.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [HitomiService],
  exports: [HitomiService],
})
export class HitomiModule {}

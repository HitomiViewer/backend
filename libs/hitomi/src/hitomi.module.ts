import { Global, Module } from '@nestjs/common';
import { HitomiService } from './hitomi.service';
import { HttpModule } from '@nestjs/axios';
import { SocksProxyAgent } from 'socks-proxy-agent';

@Global()
@Module({
  imports: [
    HttpModule.register({
      httpAgent: new SocksProxyAgent('socks5h://warproxy:1080'),
      httpsAgent: new SocksProxyAgent('socks5h://warproxy:1080'),
    }),
  ],
  providers: [HitomiService],
  exports: [HitomiService],
})
export class HitomiModule {}

import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app/app.controller';
import { HitomiModule } from '@app/hitomi';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DetailModule } from './detail/detail.module';
import { ImagesModule } from './images/images.module';
import { SearchModule } from './search/search.module';
import ms from 'ms';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`../../../.env`, `.env`],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: ms('1m'),
      max: 100,
    }),
    HitomiModule,
    DetailModule,
    ImagesModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}

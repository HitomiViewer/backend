import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminModule } from '@adminjs/nestjs';
import { HitomiModule } from '@app/hitomi';
import { AppController } from './app/app.controller';
import { DetailModule } from './detail/detail.module';
import { ImagesModule } from './images/images.module';
import { SearchModule } from './search/search.module';
import ms from 'ms';
import { AdminJSModule } from './admin.module';
import { DatabaseModule } from './database.module';
import { LogModule } from './log/log.module';

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

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
    DatabaseModule,
    AdminJSModule,
    HitomiModule,
    DetailModule,
    ImagesModule,
    SearchModule,
    LogModule,
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

import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesControllerV2 } from './images.v2.controller';

@Module({
  controllers: [ImagesController, ImagesControllerV2],
})
export class ImagesModule {}

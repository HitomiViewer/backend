import { Module } from '@nestjs/common';
import { DetailController } from './detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from 'src/log/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  controllers: [DetailController],
})
export class DetailModule {}

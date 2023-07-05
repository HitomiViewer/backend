import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  controllers: [LogController],
})
export class LogModule {}

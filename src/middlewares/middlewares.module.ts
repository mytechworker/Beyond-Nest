import { Module } from '@nestjs/common';
import { MiddlewaresController } from './middlewares.controller';
import { MiddlewaresService } from './middlewares.service';

@Module({
  controllers: [MiddlewaresController],
  providers: [MiddlewaresService]
})
export class MiddlewaresModule {}

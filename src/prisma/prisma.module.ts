import { Module } from '@nestjs/common';
import { PrismaService } from './service/service.module';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

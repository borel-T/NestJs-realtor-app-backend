import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// modules to connect to db & disconnect to db
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Module({})
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect;
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

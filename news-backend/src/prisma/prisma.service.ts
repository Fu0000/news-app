import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    // 在模块初始化时连接数据库
    await this.$connect();
  }

  async onModuleDestroy() {
    // 在模块销毁时断开数据库连接
    await this.$disconnect();
  }
}

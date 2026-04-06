import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 实例化 Prisma Client 并配置连接字符串，适配 Prisma 7.x 新特性
    super({
      datasourceUrl: process.env.DATABASE_URL,
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

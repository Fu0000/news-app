import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 将 PrismaModule 声明为全局模块，避免在其它模块中重复 import
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 导出服务供其它模块使用
})
export class PrismaModule {}

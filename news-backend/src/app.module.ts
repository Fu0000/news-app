import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { NewsModule } from './news/news.module';
import { ContentModule } from './content/content.module';
import { InteractionModule } from './interaction/interaction.module';

@Module({
  imports: [
    // 全局配置环境变量模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CommonModule,
    PrismaModule,
    UserModule,
    NewsModule,
    ContentModule,
    InteractionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

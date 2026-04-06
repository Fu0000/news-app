import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // 动态注册 JwtModule，从环境变量中读取 Secret 和过期时间
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') as any, // 规避 TypeScript 对于 ms 格式字符串的严格校验
        },
      }),
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

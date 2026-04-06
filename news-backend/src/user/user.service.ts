import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 处理用户登录/注册逻辑
   * 如果手机号不存在则自动注册
   */
  async loginOrRegister(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    // 1. 查询数据库是否存在该用户
    let user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // 2. 如果不存在，则走自动注册流程
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await this.prisma.user.create({
        data: {
          phone,
          password: hashedPassword,
          nickname: `新闻新用户_${phone.slice(-4)}`, // 默认昵称
          avatar_url: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 默认头像
        },
      });
    } else {
      // 3. 如果已存在，则验证密码是否正确
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('手机号或密码错误');
      }

      // 检查账号状态 (如是否被封禁)
      if (user.status !== 1) {
        throw new BadRequestException('该账号状态异常，无法登录');
      }
    }

    // 4. 签发 JWT Token
    // 注意：BigInt 类型在 JSON 序列化时会报错，因此将 ID 转为 string 存入 payload
    const payload = { sub: user.id.toString(), phone: user.phone };
    const token = await this.jwtService.signAsync(payload);

    // 5. 返回符合 API 契约的数据结构
    return {
      token,
      user_id: user.id.toString(),
      nickname: user.nickname,
      avatar_url: user.avatar_url,
    };
  }
}

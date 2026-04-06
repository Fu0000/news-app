import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 从请求头中提取 token: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 忽略过期的 token
      ignoreExpiration: false,
      // 使用相同的 secret 校验
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // 校验成功后，解析出的 payload 会作为 req.user 附加到请求对象上
  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('无效的凭证');
    }
    return { userId: payload.sub, phone: payload.phone };
  }
}
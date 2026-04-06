import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 创建一个专门的守卫类，使用我们刚注册的 'jwt' 策略
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
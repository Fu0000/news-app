import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('用户服务 (User Service)')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '账号注册/登录',
    description: '使用手机号+密码进行注册/登录（若手机号未注册则自动注册）。',
  })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      example: {
        code: 200,
        msg: '操作成功',
        data: {
          token: 'eyJhbGciOiJIUzI1...',
          user_id: '10001',
          nickname: '新闻新用户_8000',
          avatar_url: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        },
      },
    },
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.loginOrRegister(loginDto);
  }
}

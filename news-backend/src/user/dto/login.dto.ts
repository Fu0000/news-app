import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '手机号码',
    example: '13800138000',
  })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString({ message: '手机号格式错误' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  @ApiProperty({
    description: '登录密码',
    example: 'myPassword123',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码格式错误' })
  @Length(6, 20, { message: '密码长度需在 6 到 20 位之间' })
  password: string;
}
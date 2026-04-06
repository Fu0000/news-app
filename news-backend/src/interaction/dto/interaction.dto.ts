import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ToggleLikeDto {
  @ApiProperty({ description: '操作目标 ID (文章ID或评论ID)' })
  @IsNotEmpty({ message: '目标 ID 不能为空' })
  @IsString()
  target_id: string;

  @ApiProperty({ description: '点赞类型: 1(文章) 或 2(评论)', example: 1 })
  @IsNotEmpty({ message: '请指定点赞类型' })
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2], { message: '点赞类型必须为 1 或 2' })
  target_type: number;
}

export class PublishCommentDto {
  @ApiProperty({ description: '文章 ID' })
  @IsNotEmpty({ message: '文章 ID 不能为空' })
  @IsString()
  article_id: string;

  @ApiProperty({ description: '评论内容' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: '父级评论 ID (若为回复某人)' })
  @IsOptional()
  @IsString()
  parent_id?: string;
}
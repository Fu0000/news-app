import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublishArticleDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  title: string;

  @ApiProperty({ description: '分类 ID', example: 1 })
  @IsNotEmpty({ message: '请选择分类' })
  @IsInt()
  category_id: number;

  @ApiProperty({ description: '富文本正文' })
  @IsNotEmpty({ message: '正文内容不能为空' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: '封面图数组，最多3张', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cover_urls?: string[];
}
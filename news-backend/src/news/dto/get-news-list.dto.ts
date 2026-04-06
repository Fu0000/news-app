import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetNewsListDto {
  @ApiPropertyOptional({ description: '分类ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_id?: number;

  @ApiPropertyOptional({ description: '当前页码，默认1', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页条数，默认10', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 10;
}
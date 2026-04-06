import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { GetNewsListDto } from './dto/get-news-list.dto';

@ApiTags('内容服务 (News Service)')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('list')
  @ApiOperation({ summary: '获取新闻瀑布流列表', description: '支持按分类、分页拉取新闻列表。' })
  async getList(@Query() query: GetNewsListDto) {
    return this.newsService.getNewsList(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取新闻详情', description: '获取富文本正文，每次请求会增加阅读量。' })
  async getDetail(@Param('id') id: string) {
    return this.newsService.getNewsDetail(id);
  }
}

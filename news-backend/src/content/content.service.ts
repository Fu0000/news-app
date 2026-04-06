import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublishArticleDto } from './dto/publish-article.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  /**
   * 发布图文文章
   */
  async publishArticle(userId: string, dto: PublishArticleDto) {
    // 后端强校验：最多只允许 3 张封面图
    if (dto.cover_urls && dto.cover_urls.length > 3) {
      throw new BadRequestException('最多只能上传 3 张封面图');
    }

    const article = await this.prisma.article.create({
      data: {
        author_id: BigInt(userId),
        category_id: dto.category_id,
        title: dto.title,
        content: dto.content, // 此处省略了 XSS 过滤步骤，实际生产环境应使用 DOMPurify
        cover_urls: dto.cover_urls ? JSON.stringify(dto.cover_urls) : JSON.stringify([]),
        status: 1, // 直接发布
      },
    });

    return {
      article_id: article.id.toString(),
      message: '发布成功',
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetNewsListDto } from './dto/get-news-list.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取新闻列表 (支持分类筛选、模糊搜索与分页)
   */
  async getNewsList(query: GetNewsListDto) {
    const { keyword, category_id, page = 1, size = 10 } = query;

    // 构建查询条件：只查询已发布状态 (status: 1) 且未删除的文章
    const whereCondition: any = {
      status: 1,
      is_deleted: 0,
    };
    
    if (category_id) {
      whereCondition.category_id = category_id;
    }

    if (keyword) {
      whereCondition.OR = [
        { title: { contains: keyword } }, // Prisma 会编译为 LIKE '%keyword%'
        { content: { contains: keyword } },
      ];
    }

    // 并行执行总数查询和列表查询
    const [total, articles] = await Promise.all([
      this.prisma.article.count({ where: whereCondition }),
      this.prisma.article.findMany({
        where: whereCondition,
        skip: (page - 1) * size,
        take: size,
        orderBy: { create_time: 'desc' }, // 按时间倒序
        include: {
          author: {
            select: {
              nickname: true,
              avatar_url: true,
            },
          },
        },
      }),
    ]);

    // 组装符合 API 契约的返回格式
    const list = articles.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      cover_urls: item.cover_urls || [], // 返回图集数组
      author_name: item.author.nickname,
      author_avatar: item.author.avatar_url,
      view_count: item.view_count,
      comment_count: item.comment_count,
      publish_time: item.create_time,
    }));

    return {
      total,
      list,
    };
  }

  /**
   * 获取新闻详情
   */
  async getNewsDetail(id: string) {
    // 每次查询详情时，文章阅读量 +1 (高并发场景下应使用 Redis 异步落盘，此处为了演示简化为直接 UPDATE)
    const articleId = BigInt(id);

    const article = await this.prisma.article.findFirst({
      where: {
        id: articleId,
        status: 1,
        is_deleted: 0,
      },
      include: {
        author: {
          select: {
            nickname: true,
            avatar_url: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('该文章不存在或已下架');
    }

    // 增加阅读量
    await this.prisma.article.update({
      where: { id: articleId },
      data: { view_count: { increment: 1 } },
    });

    return {
      id: article.id.toString(),
      title: article.title,
      content: article.content, // 富文本正文
      author_id: article.author_id.toString(),
      author_name: article.author.nickname,
      author_avatar: article.author.avatar_url,
      view_count: article.view_count + 1, // 返回最新阅读量
      like_count: article.like_count,
      publish_time: article.create_time,
      has_liked: false, // 预留给鉴权接口：当前用户是否已点赞
      has_favorited: false,
    };
  }
}

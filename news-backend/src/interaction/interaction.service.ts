import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ToggleLikeDto, PublishCommentDto } from './dto/interaction.dto';

@Injectable()
export class InteractionService {
  constructor(private prisma: PrismaService) {}

  /**
   * 点赞/取消点赞 (文章或评论)
   */
  async toggleLike(userId: string, dto: ToggleLikeDto) {
    const userBigInt = BigInt(userId);
    const targetBigInt = BigInt(dto.target_id);

    // 1. 检查记录是否存在
    const record = await this.prisma.userInteraction.findFirst({
      where: {
        user_id: userBigInt,
        target_id: targetBigInt,
        target_type: dto.target_type,
        action_type: 1, // 1表示点赞
      },
    });

    // 2. 根据类型判断更新目标表
    const isArticle = dto.target_type === 1;

    if (record) {
      // 已点赞：执行取消点赞 (删除记录，减少计数)
      await this.prisma.$transaction([
        this.prisma.userInteraction.delete({ where: { id: record.id } }),
        isArticle
          ? this.prisma.article.update({
              where: { id: targetBigInt },
              data: { like_count: { decrement: 1 } },
            })
          : this.prisma.comment.update({
              where: { id: targetBigInt },
              data: { like_count: { decrement: 1 } },
            }),
      ]);
      return { is_liked: false, message: '已取消点赞' };
    } else {
      // 未点赞：执行点赞 (新增记录，增加计数)
      await this.prisma.$transaction([
        this.prisma.userInteraction.create({
          data: {
            user_id: userBigInt,
            target_id: targetBigInt,
            target_type: dto.target_type,
            action_type: 1,
          },
        }),
        isArticle
          ? this.prisma.article.update({
              where: { id: targetBigInt },
              data: { like_count: { increment: 1 } },
            })
          : this.prisma.comment.update({
              where: { id: targetBigInt },
              data: { like_count: { increment: 1 } },
            }),
      ]);
      return { is_liked: true, message: '点赞成功' };
    }
  }

  /**
   * 发表评论
   */
  async publishComment(userId: string, dto: PublishCommentDto) {
    const articleId = BigInt(dto.article_id);
    const userBigInt = BigInt(userId);

    // 验证文章是否存在
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article || article.is_deleted) {
      throw new NotFoundException('文章不存在或已被删除');
    }

    // 事务：创建评论 + 文章评论数+1
    const [comment] = await this.prisma.$transaction([
      this.prisma.comment.create({
        data: {
          target_type: 1, // 1 为文章，评论表设计为多态
          target_id: articleId,
          user_id: userBigInt,
          content: dto.content,
          parent_id: dto.parent_id ? BigInt(dto.parent_id) : BigInt(0),
        },
        include: {
          user: { select: { nickname: true, avatar_url: true } },
        },
      }),
      this.prisma.article.update({
        where: { id: articleId },
        data: { comment_count: { increment: 1 } },
      }),
    ]);

    return {
      id: comment.id.toString(),
      content: comment.content,
      author_name: comment.user.nickname,
      author_avatar: comment.user.avatar_url,
      create_time: comment.create_time,
      like_count: 0,
      message: '评论发表成功',
    };
  }

  /**
   * 获取文章评论列表
   */
  async getComments(articleId: string) {
    const comments = await this.prisma.comment.findMany({
      where: {
        target_type: 1,
        target_id: BigInt(articleId),
        is_deleted: 0,
        parent_id: BigInt(0), // 这里为简化演示，只查一级评论
      },
      orderBy: { create_time: 'desc' },
      include: {
        user: { select: { nickname: true, avatar_url: true } },
      },
    });

    return comments.map((c) => ({
      id: c.id.toString(),
      content: c.content,
      author_name: c.user.nickname,
      author_avatar: c.user.avatar_url,
      like_count: c.like_count,
      create_time: c.create_time,
      has_liked: false, // 鉴权扩展点：可结合当前登录用户判断是否点过赞
    }));
  }
}

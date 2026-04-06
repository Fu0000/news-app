import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InteractionService } from './interaction.service';
import { ToggleLikeDto, PublishCommentDto } from './dto/interaction.dto';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';

@ApiTags('互动服务 (Interaction)')
@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('like')
  @ApiOperation({ summary: '点赞 / 取消点赞', description: '如果是未点赞状态则点赞，如果已点赞则取消。' })
  async toggleLike(@Request() req: any, @Body() dto: ToggleLikeDto) {
    const userId = req.user.userId;
    return this.interactionService.toggleLike(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('comment')
  @ApiOperation({ summary: '发表评论', description: '对新闻发表评论，成功后文章评论数+1' })
  async publishComment(@Request() req: any, @Body() dto: PublishCommentDto) {
    const userId = req.user.userId;
    return this.interactionService.publishComment(userId, dto);
  }

  @Get('comments/:articleId')
  @ApiOperation({ summary: '获取文章评论列表', description: '获取指定文章下的所有评论' })
  async getComments(@Param('articleId') articleId: string) {
    return this.interactionService.getComments(articleId);
  }
}

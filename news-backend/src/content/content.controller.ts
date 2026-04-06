import { Controller, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { PublishArticleDto } from './dto/publish-article.dto';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('创作中心 (UGC)')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('publish')
  @ApiOperation({ summary: '发布图文文章', description: '需携带 Token。提交富文本内容及封面图，发布资讯。' })
  async publishArticle(@Request() req: any, @Body() dto: PublishArticleDto) {
    const userId = req.user.userId;
    return this.contentService.publishArticle(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('upload')
  @ApiOperation({ summary: '上传图片文件', description: '将图片上传到服务器本地(生产环境应替换为直传阿里云 OSS)并返回 URL' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // 存放到根目录的 uploads 文件夹
        filename: (req, file, cb) => {
          // 生成随机的文件名
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 限制 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('仅支持图片格式 (jpg/png/gif/webp)'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }
    // 返回可访问的静态资源 URL (依赖于 app.module 中配置静态资源代理)
    return {
      url: `http://localhost:3000/uploads/${file.filename}`,
    };
  }
}

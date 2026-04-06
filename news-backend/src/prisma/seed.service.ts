import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // 等待服务完全启动后再执行 seed
    setTimeout(() => this.seedData(), 2000);
  }

  async seedData() {
    const userCount = await this.prisma.user.count();
    if (userCount > 0) {
      console.log('✅ 数据库已有数据，跳过 Seed');
      return;
    }

    console.log('🌱 开始初始化测试数据...');

    // 1. 创建测试用户
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const user1 = await this.prisma.user.create({
      data: {
        phone: '13800138001',
        password: hashedPassword,
        nickname: '商业周刊主笔',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        bio: '洞察商业本质，预见未来趋势',
      },
    });

    const user2 = await this.prisma.user.create({
      data: {
        phone: '13800138002',
        password: hashedPassword,
        nickname: '科技前沿哨所',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
        bio: '分享最硬核的科技评测',
      },
    });

    // 2. 创建测试新闻 (包含单图、三图、无图情况)
    await this.prisma.article.createMany({
      data: [
        {
          author_id: user1.id,
          category_id: 1, // 推荐/商业
          title: '2024年全球人工智能发展趋势报告发布：生成式AI重塑生产力',
          content: '<p>今日，国际权威机构发布了年度AI发展白皮书，报告指出...</p>',
          cover_urls: JSON.stringify(['https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000']), // 单图
          view_count: 12400,
          comment_count: 342,
        },
        {
          author_id: user1.id,
          category_id: 2, // 科技
          title: '新能源汽车产业迎来拐点，多家车企公布第三季度创纪录财报',
          content: '<p>随着电池成本的进一步下降，以及智能化体验的升级...</p><img src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000" />',
          cover_urls: JSON.stringify([
            'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=500',
            'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=500',
            'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=500'
          ]), // 三图
          view_count: 8900,
          comment_count: 156,
        },
        {
          author_id: user2.id,
          category_id: 3, // 杂谈
          title: '深度解析：为什么极简主义设计在现代互联网应用中重新成为主流趋势？',
          content: '<p>设计是一场轮回。在经历了扁平化、拟物化、毛玻璃之后...</p>',
          cover_urls: JSON.stringify(['https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=500']), // 单图
          view_count: 4500,
          comment_count: 89,
        },
        {
          author_id: user2.id,
          category_id: 1, 
          title: '刚刚，央行宣布下调存款准备金率0.5个百分点，释放长期资金约1万亿元',
          content: '<p>为巩固经济回升向好基础，保持流动性合理充裕，中国人民银行决定...</p>',
          cover_urls: JSON.stringify([]), // 无图快讯
          view_count: 89000,
          comment_count: 2304,
        }
      ]
    });

    console.log('✅ 测试数据初始化完成！');
  }
}
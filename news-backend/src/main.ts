import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // 指定应用类型为 Express，以便配置静态文件服务
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. 设置全局 API 前缀
  app.setGlobalPrefix('api/v1');

  // 2. 启用跨域 CORS (由于前后端分离)
  app.enableCors();

  // 3. 配置静态资源目录 (为了访问上传的图片)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 4. 全局注册 DTO 参数校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剔除 DTO 中未定义的字段
      transform: true, // 自动将入参转换为 DTO 类实例
      forbidNonWhitelisted: true, // 若存在未定义字段则抛出错误
    }),
  );

  // 5. 全局注册异常过滤器 (统一错误响应 JSON 格式)
  app.useGlobalFilters(new HttpExceptionFilter());

  // 6. 全局注册拦截器 (统一成功响应 JSON 格式)
  app.useGlobalInterceptors(new TransformInterceptor());

  // 7. 配置 Swagger API 文档
  const config = new DocumentBuilder()
    .setTitle('综合新闻 APP - API 接口文档')
    .setDescription('这是基于 NestJS 开发的综合新闻应用后端服务接口规范')
    .setVersion('1.0')
    .addBearerAuth() // 启用 Bearer Token 认证
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.info(`[Bootstrap] 🚀 服务已启动: http://localhost:${port}`);
  console.info(`[Bootstrap] 📖 Swagger 接口文档: http://localhost:${port}/api/docs`);
}
bootstrap();

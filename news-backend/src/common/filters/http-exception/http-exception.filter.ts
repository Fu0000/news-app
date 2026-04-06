import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 默认服务器错误
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      // 处理 class-validator 抛出的数组格式错误
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // 在控制台打印完整的错误堆栈，方便调试（生产环境视情况可简化）
    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Message: ${
        Array.isArray(message) ? message.join(',') : message
      }`,
      exception instanceof Error ? exception.stack : '',
    );

    // 组装统一的 JSON 响应结构
    response.status(status).json({
      code: status,
      msg: Array.isArray(message) ? message[0] : message, // 如果是校验错误数组，只取第一个提示前端
      data: null,
    });
  }
}
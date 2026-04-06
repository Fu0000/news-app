import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  code: number;
  msg: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // 如果 Controller 已经手动返回了标准的 { code, msg, data } 结构，则直接返回
        if (data && typeof data === 'object' && 'code' in data && 'msg' in data) {
          return data;
        }
        
        // 否则统一包裹为标准结构
        return {
          code: 200,
          msg: '操作成功',
          data: data ?? null,
        };
      }),
    );
  }
}
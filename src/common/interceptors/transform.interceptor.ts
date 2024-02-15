import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenericResponseDto } from '../dtos/generic-response.dto';
import { FastifyReply } from 'fastify';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, GenericResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<GenericResponseDto<T>> {
    const response: FastifyReply = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        data,
        error: null,
        statusCode: response.statusCode,
      })),
    );
  }
}

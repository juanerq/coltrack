import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { GenericResponseDto } from '../dtos/generic-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();

    const response: GenericResponseDto<[]> = {
      data: [],
      statusCode: status,
      error: exception.name,
      message: exception.message,
    };

    reply.send(response);
  }
}

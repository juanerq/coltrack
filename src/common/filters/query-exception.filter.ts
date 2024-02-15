import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryFailedError } from 'typeorm';
import { GenericResponseDto } from '../dtos/generic-response.dto';

@Catch(QueryFailedError)
export class QueryExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(QueryExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const code = (exception as any).code;
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let stack = `\n[ Stack ]: ${exception.stack}\n`;

    if (code == 23505) {
      httpStatus = HttpStatus.CONFLICT;
      message = 'Record already exists';
      stack = '';
    } else if (code == 23503) {
      httpStatus = HttpStatus.NOT_FOUND;
      message = 'Record not exists';
      stack = '';
    }

    const logErrorMsg = `[ Exception Database (${code}) ]: ${exception.message} [ Path ]: ${request.url} ${stack}[ Query ]: ${exception.query}`;

    this.logger.error(logErrorMsg);

    const response: GenericResponseDto<[]> = {
      statusCode: httpStatus,
      error: exception.name,
      message,
      data: [],
    };

    reply.send(response);
  }
}

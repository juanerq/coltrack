import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CookiesAuth } from 'src/contexts/auth/interfaces/cookies-auth.interface';

export type CookiesType = keyof CookiesAuth;

export const Cookies = createParamDecorator(
  (data: CookiesType, ctx: ExecutionContext) => {
    const request: FastifyReply = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);

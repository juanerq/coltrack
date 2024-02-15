import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    if (data) {
      const property = user[data];
      if (!property)
        throw new InternalServerErrorException(`User not found (${data})`);

      return property;
    }

    return user;
  },
);

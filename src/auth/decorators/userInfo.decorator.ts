import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const userInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ? request.user : null;
  },
);

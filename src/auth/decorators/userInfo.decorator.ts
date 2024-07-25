import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const userInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ? request.user : null;
    // const user = request.user;

    // return data ? user?.[data] : user;
  },
);

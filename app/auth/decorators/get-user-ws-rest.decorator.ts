import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetWSOrRESTUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;

    return data ? user?.[data] : user;
  },
);

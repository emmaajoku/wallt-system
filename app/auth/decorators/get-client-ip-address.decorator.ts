import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as requestIp from 'request-ip';

export const GetClientIP = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (req.clientIp) return req.clientIp;
    return requestIp.getClientIp(req); // In case we forgot to include requestIp.mw() in main.ts
  },
);

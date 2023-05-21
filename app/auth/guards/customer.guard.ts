import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class customerGuard extends AuthGuard('customer') {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

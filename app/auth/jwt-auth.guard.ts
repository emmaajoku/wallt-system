import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    // Add your asynchronous authentication logic here
    return super.canActivate(new ExecutionContextHost([req]));
  }
}

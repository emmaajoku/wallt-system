import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const ExcludeFieldMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const originalValue: string = await next();
  console.log({ originalValue });
  return '';
};

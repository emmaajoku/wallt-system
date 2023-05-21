import { ArgsType, Field } from '@nestjs/graphql';
import { MinLength, MaxLength, IsUUID } from 'class-validator';

@ArgsType()
export class ResetPasswordArgs {
  @MinLength(20)
  @MaxLength(100)
  @IsUUID()
  @Field()
  verifyToken: string;

  @MinLength(5)
  @MaxLength(50)
  @Field()
  password: string;
}

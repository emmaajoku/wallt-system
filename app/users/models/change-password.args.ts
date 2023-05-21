import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@ArgsType()
export class ChangePasswordArgs {
  @Field()
  @IsNotEmpty()
  @MinLength(6)
  currentPassword: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

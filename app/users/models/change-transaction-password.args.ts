import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@ArgsType()
export class UpdateTransactionPasswordArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @MinLength(4, { message: 'password must be at least 4 characters' })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @MinLength(4, { message: 'password must be at least 4 characters' })
  confirmPassword: string;

  @Field()
  phone?: string;

  @Field()
  emailAddress?: string;
}

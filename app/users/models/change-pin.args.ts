import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@ArgsType()
export class ChangePasswordArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  oldPassword: string;

  @IsString()
  @Field()
  emailAddress?: string;

  @Field()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  newPassword: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  confirmPassword: string;
}

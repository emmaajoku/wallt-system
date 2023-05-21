import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

@ArgsType()
export class LogInUserArgs {
  @Field()
  @IsString()
  @IsEmail()
  emailAddress?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}

import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

@ArgsType()
export class RequestVerifyEmailArgs {
  @Field()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

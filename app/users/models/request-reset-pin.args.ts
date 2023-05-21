import { ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

@ArgsType()
export class RequestResetPasswordArgs {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;
}

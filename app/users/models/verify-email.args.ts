import { ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, IsEmail } from 'class-validator';

@ArgsType()
export class VerifyEmailArgs {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;
}

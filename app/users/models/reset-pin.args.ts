import { ArgsType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

@ArgsType()
export class ResetPasswordArgs {
  @IsOptional()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  confirmPassword: string;
}

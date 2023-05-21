import { ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@ArgsType()
export class ValidatePasswordArgs {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

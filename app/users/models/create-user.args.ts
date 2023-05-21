import { ArgsType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@ArgsType()
export class CreateUserArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  emailAddress?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsMobilePhone('en-NG', { message: 'Phone number is not valid' })
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceModel?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceIp?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  transactionPassword?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  platform?: string;
}

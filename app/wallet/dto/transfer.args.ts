import { ArgsType, Field, Float } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

@ArgsType()
export class TransferArgs {
  @Field({ nullable: true })
  @IsNotEmpty()
  @IsString()
  userId?: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  receiver: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(100)
  amount: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  transactionPassword: string;
}

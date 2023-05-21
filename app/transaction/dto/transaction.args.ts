import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { TransactionType } from '../constants/transaction.enum';
import { TransactionStatus } from '../constants/transaction.enum';
import { ArgsType, Field } from '@nestjs/graphql';
import { User } from '@prisma/client';

@ArgsType()
export class TransactionAgs {
  @IsNotEmpty()
  @Field()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  amount: number;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  @Field()
  type: TransactionType;

  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  @Field()
  status: TransactionStatus;

  @IsNotEmpty()
  @IsString()
  @Field()
  reference: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  narration: string;
}

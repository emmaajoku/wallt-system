import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Length, IsString } from 'class-validator';

@ArgsType()
export class ResetTransactionPasswordArgs {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @Field()
  transactionPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @Field()
  confirmPassword: string;

  @Field()
  emailAddress?: string;

  @Field()
  phone?: string;
}

import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@ArgsType()
export class ChangeTransactionPasswordArgs {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @Field()
  newPassword: string;

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

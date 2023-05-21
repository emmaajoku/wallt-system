import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class RegistrationLinkArgs {
  @MinLength(10)
  @MaxLength(300)
  @IsEmail()
  @Field()
  emailAddress: string;

  @MinLength(5)
  @MaxLength(50)
  @Field()
  name: string;
}

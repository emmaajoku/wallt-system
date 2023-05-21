import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class AuthCredentialsArgs {
  @Field()
  emailAddress: string;

  @Field()
  password: string;
}

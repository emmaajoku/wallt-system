import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SignUpArgs {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  emailAddress?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  deviceId?: string;

  @Field({ nullable: true })
  deviceModel?: string;

  @Field({ nullable: true })
  deviceIp?: string;

  @Field({ nullable: true })
  transactionPassword?: string;

  @Field({ nullable: true })
  platform?: string;
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserModel {
  @Field(() => String)
  userId?: string;

  @Field()
  firstName?: string;

  @Field()
  lastName?: string;

  @Field()
  emailAddress?: string;

  @Field()
  password?: string;

  @Field()
  phone?: string;

  @Field()
  transactionPassword?: string;

  @Field()
  verified?: boolean;

  @Field()
  resetToken?: string;

  // @Field()
  // resetTokenExpiry?: string;

  @Field()
  dob?: string;

  @Field()
  isAdmin?: boolean;

  @Field()
  deviceId?: string;

  @Field()
  deviceIp?: string;

  @Field()
  platform?: string;

  @Field()
  lastLoggedIn?: string;

}

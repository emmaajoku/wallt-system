import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from 'app/users/models/user.model';

@ObjectType('Wallet')
export class WalletModel {
  @Field(() => String)
  id: string;

  @Field(() => Number)
  balance: number;

  @Field(() => UserModel, { nullable: true })
  user?: UserModel;

  @Field(() => String, { nullable: true })
  userId?: string;
}

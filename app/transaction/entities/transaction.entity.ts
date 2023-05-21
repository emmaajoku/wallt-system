import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TransactionModel {
  @Field(() => String)
  id: string;

  @Field()
  userId: string;

  @Field()
  amount: number;

  @Field()
  type: string;

  @Field()
  status: string;

  @Field()
  reference: string;

  @Field()
  narration: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

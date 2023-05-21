import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Emailer')
export class Emailer {
  @Field(() => String)
  id: string;

  @Field({ nullable: true })
  verifyToken?: string;

  @Field({ nullable: true })
  emailAddress?: string;

  @Field({ defaultValue: 2 + 15 * 60 * 1000 })
  verifyTokenExpiry?: number;

  @Field({ defaultValue: true })
  valid?: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from 'app/users/models/user.model';

@ObjectType('JwtUserResponseModel')
export class JwtUserResponse {
  @Field(() => String, {
    description:
      "The user's access token. To be added in the header when making requests to guarded api routes",
  })
  accessToken: string;

  @Field(() => UserModel, {
    description: "The user's profile details",
  })
  user: UserModel;
}

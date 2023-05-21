import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LogInUserArgs } from 'app/users/models/login.args';
import { SignUpArgs } from 'app/users/models/signup.args';
import { UserModel } from 'app/users/models/user.model';
import { JwtUserResponse } from './models/jwt-response.model';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => JwtUserResponse)
  async login(
    @Args() authCredentials: LogInUserArgs,
  ): Promise<JwtUserResponse> {
    return await this.authService.login(authCredentials);
  }

  @Mutation(() => UserModel)
  async register(@Args() authCredentials: SignUpArgs): Promise<UserModel> {
    return await this.authService.signup(authCredentials);
  }
}

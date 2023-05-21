import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'app/auth/jwt-auth.guard';
import { ResponseStruct } from 'app/wallet/interfaces/response.interface';
import { UserModel } from './models/user.model';
import { User } from '@prisma/client';
import { ChangePasswordArgs } from './models/change-pin.args';
import { UpdateTransactionPasswordArgs } from './models/change-transaction-password.args';
import { RequestResetPasswordArgs } from './models/request-reset-pin.args';
import { RequestVerifyEmailArgs } from './models/request-verify-email.args';
import { ResetPasswordArgs } from './models/reset-pin.args';
import { ResetTransactionPasswordArgs } from './models/reset-transaction-pin.args';
import { UsersService } from './users.service';
import { customerGuard } from 'app/auth/guards/customer.guard';

@Resolver()
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @UseGuards(customerGuard)
  @Query(() => UserModel)
  async findUserById(
    @Context('user') user: { userId: string },
  ): Promise<ResponseStruct> {
    const getUser = await this.userService.findUserById(user.userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: getUser,
    };
  }

  @UseGuards(customerGuard)
  @Mutation(() => UserModel)
  async update(
    @Args('id') id: string,
    @Args('input') input: Partial<User>,
  ): Promise<ResponseStruct> {
    return await this.userService.updateUser(id, input);
  }

  @UseGuards(customerGuard)
  @Mutation(() => UserModel)
  async changePassword(
    @Args('input') input: ChangePasswordArgs,
    @Context('user') user: any,
  ): Promise<ResponseStruct> {
    return await this.userService.updatePassword(input, user.userId);
  }

  @UseGuards(customerGuard)
  @Mutation(() => UserModel)
  async setTransactionPassword(
    @Args() data: UpdateTransactionPasswordArgs,
  ): Promise<ResponseStruct> {
    return await this.userService.setTransactionPassword(data);
  }

  @UseGuards(customerGuard)
  @Mutation(() => UserModel)
  async resetTransactionPassword(
    @Args() input: ResetTransactionPasswordArgs,
  ): Promise<ResponseStruct> {
    return await this.userService.resetTransactionPassword(
      input.emailAddress,
      input,
    );
  }

  @UseGuards(customerGuard)
  @Mutation(() => UserModel)
  async sendVerificationEmail(
    @Args() requestVerifyEmailArgs: RequestVerifyEmailArgs,
  ): Promise<ResponseStruct> {
    return await this.userService.requestVerifyEmail(requestVerifyEmailArgs);
  }

  @Mutation(() => UserModel)
  async verifyEmail(
    @Args('token') token: string,
    @Args('emailAddress') emailAddress: string,
  ): Promise<ResponseStruct> {
    return await this.userService.verifyEmail({
      token: token,
      emailAddress: emailAddress,
    });
  }

  @Mutation(() => UserModel)
  async requestResetPassword(
    @Args('input') input: RequestResetPasswordArgs,
  ): Promise<ResponseStruct> {
    return await this.userService.requestResetPassword(input);
  }

  @Mutation(() => UserModel)
  async resetPassword(
    @Args('resetToken') resetToken: string,
    @Args('input') input: ResetPasswordArgs,
  ): Promise<ResponseStruct> {
    return await this.userService.resetPassword({
      ...input,
      token: resetToken,
    });
  }

  @UseGuards(customerGuard)
  @Mutation(() => UserModel)
  async changeTransactionPassword(
    @Args() updateTransactionPasswordArgs: UpdateTransactionPasswordArgs,
  ): Promise<ResponseStruct> {
    return await this.userService.updateTransactionPassword(
      updateTransactionPasswordArgs,
    );
  }
}

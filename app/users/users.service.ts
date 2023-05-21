import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaDatabaseService } from '../databases/prisma-database.service';
import { Emailer, User } from '@prisma/client';
import { UserNotFoundException } from 'app/exceptions/user-notfound-exception';
import {
  AccountNotVerifiedException,
  IncorrectCredentialsException,
  TokenExpiredException,
} from 'app/exceptions';
import { ResponseStruct } from 'app/wallet/interfaces';
import { LogInUserArgs } from './models/login.args';
import { hashPassword, matchPasswordHash } from 'app/utils/password-hash';
import { RequestVerifyEmailArgs } from './models/request-verify-email.args';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { config } from 'app/config/config';
import { EmailOption } from 'app/mail/types/mail.types';
import { mailStructure } from 'app/mail/interface-send/mail.send';
import { VerifyEmailArgs } from './models/verify-email.args';
import { ChangePasswordArgs } from './models/change-pin.args';
import { UpdateTransactionPasswordArgs } from './models/change-transaction-password.args';
import { RequestResetPasswordArgs } from './models/request-reset-pin.args';
import { ResetPasswordArgs } from './models/reset-pin.args';
import { ResetTransactionPasswordArgs } from './models/reset-transaction-pin.args';
import { ValidatePasswordArgs } from './models/validate-pin.args';
import { TransactionPasswordNotSetException } from 'app/exceptions/transaction-password-not-set';

@Injectable()
export class UsersService {
  constructor(
    private databaseService: PrismaDatabaseService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findUser(login: LogInUserArgs): Promise<User> {
    try {
      const singleUser = await this.databaseService.user.findMany({
        where: {
          emailAddress: login.emailAddress,
        },
      });

      if (!singleUser.length) {
        throw new UserNotFoundException();
      }
      const matchPasswordHashPassword = singleUser[0].password;

      const validPassword: boolean = await matchPasswordHash(
        login.password,
        matchPasswordHashPassword,
      );

      if (!!singleUser.length || !validPassword) {
        throw new IncorrectCredentialsException(`Your password is incorrect`);
      }

      return singleUser[0];
    } catch (err) {
      throw new BadRequestException('incorrect credentials!');
    }
  }

  async findUserById(userId: string): Promise<User> {
    try {
      const singleUser = await this.databaseService.user.findFirst({
        where: { userId },
      });
      if (!singleUser) throw new UserNotFoundException();
      return singleUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findUserByEmail(emailAddress: string): Promise<User> {
    try {
      const singleUser = await this.databaseService.user.findFirst({
        where: { emailAddress: emailAddress },
      });

      if (!singleUser) throw new UserNotFoundException();
      return singleUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async isVerifiedUser(id: string): Promise<void | User> {
    try {
      const singleUser = await this.findUserById(id);
      if (!singleUser?.verified) {
        throw new AccountNotVerifiedException();
      }
      return singleUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(id: string, user: Partial<User>): Promise<ResponseStruct> {
    try {
      const singleUser = await this.findUserById(id);
      if (user?.password || user?.transactionPassword) {
        throw new BadRequestException(
          'try updating your tokens/pins in their specific endpoints',
        );
      }

      const updatedUser = await this.databaseService.user.updateMany({
        where: { emailAddress: singleUser.emailAddress },
        data: {
          ...user,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'user updated successfully',
        data: updatedUser,
      };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  async requestVerifyEmail(
    data: RequestVerifyEmailArgs,
  ): Promise<ResponseStruct> {
    try {
      const checkEmail: Emailer[] = await this.databaseService.emailer.findMany(
        {
          where: {
            emailAddress: data.emailAddress,
            valid: true,
          },
        },
      );
      const token = uuidv4().split('-').join('');
      const expiry = Date.now() + 1440 * 60 * 1000;
      // update the emailver row if the phone number already exists else create a new one
      checkEmail
        ? await this.databaseService.emailer.updateMany({
            where: { emailAddress: data.emailAddress },
            data: {
              verifyToken: token,
              verifyTokenExpiry: expiry,
              emailAddress: data.emailAddress,
              valid: true,
            },
          })
        : await this.databaseService.emailer.updateMany({
            where: { emailAddress: data.emailAddress },
            data: {
              verifyToken: token,
              verifyTokenExpiry: expiry,
              emailAddress: data.emailAddress,
            },
          });

      // send mail
      const verifyEmail: EmailOption = mailStructure(
        [data.emailAddress],
        'support@dabawallet.com',
        'Verify Your Account',
        config?.sendGrid?.tempateVerifyAccunt,
        {
          firstName: `${data?.firstName}`,
          subject: 'Verify Your Account',
          verifyLink: `${config?.sendGrid?.baseurl}/user/verify/${token}/${data.emailAddress}`,
        },
      );

      this.eventEmitter.emit('user.verification', verifyEmail);
      return {
        statusCode: HttpStatus.OK,
        message: 'Email verification link sent successfully!',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyEmail(data: VerifyEmailArgs): Promise<ResponseStruct> {
    try {
      const findEmailVerifyToken: Emailer =
        await this.databaseService.emailer.findFirst({
          where: {
            verifyToken: data.token,
            valid: true,
            emailAddress: data.emailAddress,
          },
        });

      if (!findEmailVerifyToken) {
        throw new BadRequestException('invalid token!');
      }
      if (
        findEmailVerifyToken?.verifyTokenExpiry < Date.now() ||
        !findEmailVerifyToken?.valid
      ) {
        await this.databaseService.emailer.updateMany({
          where: { emailAddress: data.emailAddress },
          data: {
            valid: false,
          },
        });
        throw new BadRequestException(
          'token expired!, please try verifying your emailAddress again',
        );
      }
      // delete this particular emailer row instance
      const user = await this.databaseService.user.findFirst({
        where: {
          emailAddress: data.emailAddress,
          verified: false,
        },
      });

      if (!user) {
        throw new UserNotFoundException(
          'oops, seems this account has already been verified',
        );
      }
      await this.databaseService.user.updateMany({
        where: { emailAddress: data.emailAddress },
        data: {
          verified: true,
        },
      });

      await this.databaseService.user.deleteMany({
        where: {
          emailAddress: data.emailAddress,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Email verified successfully!',
      };
    } catch (error) {
      throw new BadRequestException(
        'An error occurred!, it seems the link is invalid or this account has already been verified',
      );
    }
  }

  async updatePassword(
    data: ChangePasswordArgs,
    id: string,
  ): Promise<ResponseStruct> {
    try {
      const user = await this.findUserById(id);
      if (!(await matchPasswordHash(data.oldPassword, user.password)))
        throw new IncorrectCredentialsException('incorrect password!');

      if (data.newPassword !== data.confirmPassword)
        throw new IncorrectCredentialsException('password mismatch!');

      const passwordHashed: string = await hashPassword(data.newPassword);

      await this.databaseService.user.updateMany({
        where: { emailAddress: user.emailAddress },
        data: {
          password: passwordHashed,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'password updated successfully',
      };
    } catch (error) {
      throw new IncorrectCredentialsException(error.message);
    }
  }

  async resetPassword(data: ResetPasswordArgs): Promise<ResponseStruct> {
    try {
      const findUserToken = await this.databaseService.user.findFirst({
        where: {
          resetToken: data.token,
        },
      });

      if (!findUserToken || Date.now() > findUserToken.resetTokenExpiry)
        throw new TokenExpiredException(
          'This token is invalid, please try resetting your password again',
        );

      if (data.password !== data.confirmPassword) {
        throw new IncorrectCredentialsException('password mismatch!');
      }
      const Passwordhash: string = await hashPassword(data.password);
      await this.databaseService.user.updateMany({
        where: { emailAddress: findUserToken.emailAddress },
        data: {
          password: Passwordhash,
          resetToken: '',
          resetTokenExpiry: Date.now(),
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'password reset successful!',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async requestResetPassword(
    data: RequestResetPasswordArgs,
  ): Promise<ResponseStruct> {
    try {
      const findUser: User = await this.findUserByEmail(data.emailAddress);
      if (!findUser) throw new UserNotFoundException();

      const token = uuidv4().split('-').join('');
      const resetTokenExpiry = Date.now() + 30 * 60 * 1000;

      await this.databaseService.user.updateMany({
        where: { emailAddress: data.emailAddress },
        data: {
          resetToken: token,
          resetTokenExpiry: resetTokenExpiry,
        },
      });
      // send emailAddress
      const resetPassword: EmailOption = mailStructure(
        [data.emailAddress],
        'support@dabawallet.com',
        'Reset your password',
        config.sendGrid.tempateResetPassword,
        {
          firstName: `${findUser.firstName}`,
          subject: 'Reset Your password',
          resetLink: `${config.sendGrid.baseurl}/user/reset-password/${token}`,
        },
      );

      this.eventEmitter.emit('user.reset-password', resetPassword);
      return {
        statusCode: HttpStatus.OK,
        message: 'Reset password link sent successfully!',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async setTransactionPassword(
    data: UpdateTransactionPasswordArgs,
  ): Promise<ResponseStruct> {
    try {
      const findUser: User = await this.findUserByEmail(data.emailAddress);
      if (findUser.transactionPassword) {
        throw new BadRequestException(
          'oops, it seems you already have a transaction password set up, if you want to change your password, try updating it in the user settings',
        );
      }
      if (data.newPassword !== data.confirmPassword) {
        throw new IncorrectCredentialsException(
          'transaction password mismatch!',
        );
      }

      const transactionPassword = await hashPassword(data.newPassword);

      await this.databaseService.user.updateMany({
        where: { emailAddress: findUser.emailAddress },
        data: {
          transactionPassword: transactionPassword,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'transaction password set successfully !',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validateTransactionPassword(
    data: ValidatePasswordArgs,
  ): Promise<ResponseStruct> {
    try {
      const findUser: User = await this.findUserById(data.userId);
      if (!findUser.transactionPassword) {
        throw new TransactionPasswordNotSetException();
      }
      if (
        !(await matchPasswordHash(data.password, findUser.transactionPassword))
      ) {
        throw new IncorrectCredentialsException(
          'incorrect transactionPassword!',
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'success!',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resetTransactionPassword(
    id: string,
    data: ResetTransactionPasswordArgs,
  ): Promise<ResponseStruct> {
    try {
      const findUser: User = await this.findUserById(id);
      if (data.transactionPassword !== data.confirmPassword)
        throw new IncorrectCredentialsException(
          ' transaction password mismatch!',
        );
      const transactionPassword = await hashPassword(data.transactionPassword);

      await this.databaseService.user.updateMany({
        where: { emailAddress: findUser.emailAddress },
        data: {
          transactionPassword: transactionPassword,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'transaction password reset successfully!',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateTransactionPassword(
    data: UpdateTransactionPasswordArgs,
  ): Promise<ResponseStruct> {
    try {
      const user = await this.findUserByEmail(data.emailAddress);
      if (
        !(await matchPasswordHash(data.oldPassword, user.transactionPassword))
      ) {
        throw new IncorrectCredentialsException(
          'incorrect transaction password!',
        );
      }

      if (data.newPassword !== data.confirmPassword) {
        throw new IncorrectCredentialsException('password mismatch!');
      }

      const transactionPassword = await hashPassword(data.newPassword);

      await this.databaseService.user.updateMany({
        where: { emailAddress: user.emailAddress },
        data: {
          transactionPassword: transactionPassword,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'transaction password updated successfully',
      };
    } catch (error) {
      throw new IncorrectCredentialsException(error.message);
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const singleUser = await this.findUserById(id);
      if (!singleUser?.verified) {
        throw new AccountNotVerifiedException();
      }
      return singleUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

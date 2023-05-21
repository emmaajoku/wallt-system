import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { DataConflictException } from '../exceptions';
import { LogInUserArgs } from 'app/users/models/login.args';
import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { hashPassword, matchPasswordHash } from 'app/utils/password-hash';
import { SignUpArgs } from 'app/users/models/signup.args';
import { JwtService } from '@nestjs/jwt';
import { config } from 'app/config/config';
import { UserModel } from 'app/users/models/user.model';
import { JwtUserResponse } from './models/jwt-response.model';
import { User } from '@prisma/client';
import moment = require('moment');

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaDatabaseService: PrismaDatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(obj: LogInUserArgs): Promise<JwtUserResponse> {
    try {
      const { emailAddress, password } = obj;
      const user = await this.prismaDatabaseService.user.findFirst({
        where: { emailAddress: emailAddress },
      });

      Logger.debug(user);

      const chcekPassword: boolean = await matchPasswordHash(
        password,
        user.password,
      );
      if (!chcekPassword) {
        throw new BadRequestException('Invalid emailAddress or password');
      }

      const newUser: User = await this.prismaDatabaseService.user.update({
        where: { userId: user.userId },
        data: { lastLoggedIn: new Date().toISOString() },
      });

      return {
        accessToken: await this.createToken(emailAddress),
        user: newUser,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async signup(obj: SignUpArgs): Promise<UserModel> {
    try {
      const { emailAddress, phone } = obj;
      const existingUser = await this.prismaDatabaseService.user.count({
        where: { OR: [{ emailAddress: emailAddress }, { phone }] },
      });

      // Check if user already exists
      if (existingUser) {
        throw new DataConflictException('This user already exists!');
      }

      const hashValuePassword = await hashPassword(obj.password);
      const newUser: User = await this.prismaDatabaseService.user.create({
        data: {
          ...obj,
          password: hashValuePassword,
        },
      });

      // Create the user wallet
      await this.prismaDatabaseService.wallet.create({
        data: { userId: newUser.userId },
      });

      return newUser;
    } catch (err) {
      throw new DataConflictException(err.message);
    }
  }

  /**
   * Create a JWT based on parameters received
   * @param email - The token issuer, used to indicate who issued the token.
   * @param password - user ID that the token being issued to.
   */
  async createToken(emailAddress: string): Promise<any> {
    const validateUser = await this.prismaDatabaseService.user.findFirst({
      where: { emailAddress: emailAddress },
    });
    const privateKey = config.jwt.private_key;
    const publicKey = config.jwt.public_key;

    if (!privateKey) {
      throw new NotFoundException(`Unable to find find issuer private key`);
    }
    if (!publicKey) {
      throw new NotFoundException(`Unable to find find issuer public key`);
    }

    try {
      const privateKey = Buffer.from(config.jwt.private_key, 'base64').toString(
        'ascii',
      );

      const jwtToken = this.jwtService.sign(
        {
          emailAddress: validateUser?.emailAddress,
          userId: validateUser?.userId,
        },
        {
          privateKey: privateKey,
          // secret: config.auth.secret,
          algorithm: 'RS256',
        },
      );
      return jwtToken;
    } catch (exception) {
      console.log(exception);
      throw new InternalServerErrorException('Unable to generate JWT');
    }
  }
}

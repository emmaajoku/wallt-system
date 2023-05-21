import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { config } from 'app/config/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PrismaDatabaseService } from 'app/databases/prisma-database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private databaseService: PrismaDatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(config.jwt.public_key, 'base64').toString(
        'ascii',
      ),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { emailAddress } = payload;

    const user = await this.databaseService.user.findFirst({
      where: { emailAddress: emailAddress },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

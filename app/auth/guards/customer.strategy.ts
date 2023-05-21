import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'app/users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class customerJwtStrategy extends PassportStrategy(Strategy, 'customer') {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { userId } = payload;
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

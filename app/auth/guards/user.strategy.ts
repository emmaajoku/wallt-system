import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from 'app/users/users.service';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

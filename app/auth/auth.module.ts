import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { DatabasesModule } from 'app/databases/databases.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from 'app/users/users.service';
import { UsersModule } from 'app/users/users.module';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { JwtStrategy } from './jwt.strategy';
import { customerJwtStrategy } from './guards/customer.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => DatabasesModule),
    forwardRef(() => ConfigModule),
    forwardRef(() => PassportModule),
    forwardRef(() => EventEmitterModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: '180d', //2592000, //long-lived token lasts up to 6 months
        },
      }),
    }),
  ],
  providers: [
    customerJwtStrategy,
    AuthResolver,
    AuthService,
    UsersService,
    JwtService,
    EventEmitter2,
  ],
  exports: [AuthService, JwtService, customerJwtStrategy, PassportModule],
})
export class AuthModule {}

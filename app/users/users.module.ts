import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabasesModule } from '../databases/databases.module';
import { AuthModule } from 'app/auth/auth.module';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [forwardRef(() => AuthModule), DatabasesModule, EventEmitterModule],
  providers: [UsersService, EventEmitter2],
  exports: [UsersService],
})
export class UsersModule {}

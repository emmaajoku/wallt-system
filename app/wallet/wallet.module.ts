import { Module, forwardRef } from '@nestjs/common';
import { WalletResolver } from './wallet.resolver';
import { WalletService } from './wallet.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from 'app/users/users.module';
import { TransactionModule } from 'app/transaction/transaction.module';
import { DatabasesModule } from 'app/databases/databases.module';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [WalletResolver, WalletService, EventEmitter2],
  imports: [
    forwardRef(() => TransactionModule),
    UsersModule,
    AuthModule,
    EventEmitterModule,
    DatabasesModule,
  ],
  exports: [WalletService],
})
export class WalletModule {}

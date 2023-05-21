import { Module, forwardRef } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { DatabasesModule } from 'app/databases/databases.module';
import { WalletModule } from 'app/wallet/wallet.module';

@Module({
  imports: [forwardRef(() => WalletModule), DatabasesModule],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}

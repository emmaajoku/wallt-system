import { Module, forwardRef } from '@nestjs/common';
import { WalletResolver } from './wallet.resolver';
import { WalletService } from './wallet.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from 'app/users/users.module';
import { TransactionModule } from 'app/transaction/transaction.module';
import { DatabasesModule } from 'app/databases/databases.module';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [
    WalletResolver, 
    WalletService, 
    EventEmitter2, {
    provide: 'KAFKA_PRODUCER',
    useFactory: async (kafkaClient: ClientKafka) => {
      return kafkaClient.connect();
    },
    inject: ['CLIENT_KAFKA'],
  },
],
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transfer',
            brokers: ['pkc-6ojv2.us-west4.gcp.confluent.cloud:9092'],
          },
          consumer: {
            groupId: 'transfer',
          },
        },
      },
    ]),
    forwardRef(() => TransactionModule),
    UsersModule,
    AuthModule,
    EventEmitterModule,
    DatabasesModule,
  ],
  exports: [WalletService],
})
export class WalletModule {}

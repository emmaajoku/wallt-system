import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';

import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabasesModule } from './databases/databases.module';
import { EnvValidationSchema } from './env-validation.schema';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        playground:
          configService.get('APP_ENV') === 'development' ||
          configService.get('APP_ENV') === 'production',
        debug: false,
        uploads: false,
        autoSchemaFile: join(process.cwd(), 'graphql-schema/schema.gql'),
        buildSchemaOptions: {
          numberScalarMode: 'integer',
        },
        cors: {
          origin: ['http://localhost:3000', 'http://localhost:3001'],
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: [
            'X-Requested-With',
            'Content-Type',
            'X-Token-Auth',
            'Authorization',
          ],
          credentials: true,
        },
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      validationSchema: EnvValidationSchema,
    }),
    DatabasesModule,
    AuthModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { HttpStatus, Injectable } from '@nestjs/common';
import {
  InternalErrorException,
  TransactionNotFoundException,
} from '../exceptions';
import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { Transactions } from '@prisma/client';
import { TransactionAgs } from './dto/transaction.args';
import { ResponseStruct } from 'app/wallet/interfaces/response.interface';

@Injectable()
export class TransactionService {
  constructor(private prismaDatabaseService: PrismaDatabaseService) {}

  async createTransaction(payload: TransactionAgs): Promise<Transactions> {
    try {
      const newTransaction =
        await this.prismaDatabaseService.transactions.create({
          data: payload,
        });
      return newTransaction;
    } catch (err: any) {
      throw new InternalErrorException(err.message);
    }
  }

  async viewUserTransactions(userId: string): Promise<ResponseStruct> {
    try {
      const userTransactions =
        await this.prismaDatabaseService.transactions.findMany({
          where: { userId: userId },
        });
      if (!userTransactions.length) {
        throw new TransactionNotFoundException();
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'transactions retrieved successfully',
        data: userTransactions,
      };
    } catch (err: any) {
      throw new TransactionNotFoundException();
    }
  }

  async getTransactionDetail(
    transactionId: string,
    userId: string,
  ): Promise<ResponseStruct> {
    try {
      const transaction =
        await this.prismaDatabaseService.transactions.findFirst({
          where: { id: transactionId, userId: userId },
        });
      if (!transaction) {
        throw new TransactionNotFoundException();
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'transaction retrieved successfully',
        data: transaction,
      };
    } catch (err: any) {
      throw new TransactionNotFoundException();
    }
  }
}

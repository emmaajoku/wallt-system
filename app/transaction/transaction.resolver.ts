import { Resolver, Query, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { TransactionModel } from './entities/transaction.entity';
import { UseGuards } from '@nestjs/common';
import { ResponseStruct } from 'app/wallet/interfaces';
import { customerGuard } from 'app/auth/guards/customer.guard';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(customerGuard)
  @Query(() => TransactionModel)
  async getUserTransactions(
    @Args('userId') userId: string,
  ): Promise<ResponseStruct> {
    return await this.transactionService.viewUserTransactions(userId);
  }

  @UseGuards(customerGuard)
  @Query(() => TransactionModel)
  async getTransactionDetail(
    @Args('transactionId') transactionId: string,
    @Args('userId') userId: string,
  ): Promise<ResponseStruct> {
    try {
      const transaction = await this.transactionService.getTransactionDetail(
        transactionId,
        userId,
      );
      return transaction;
    } catch (err: any) {
      throw new Error('Failed to retrieve transaction detail');
    }
  }
}

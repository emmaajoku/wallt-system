import { User, Wallet } from '@prisma/client';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
  TransactionType,
  TransactionStatus,
} from '../transaction/constants/transaction.enum';

import {
  InsufficientTokensException,
  InternalErrorException,
  WalletNotFoundException,
} from '../exceptions';
import { UsersService } from 'app/users/users.service';
import { ResponseStruct } from './interfaces/response.interface';
import { config } from 'app/config/config';
import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { TransferArgs } from './dto/transfer.args';
import { mailStructure } from 'app/mail/interface-send/mail.send';
import { EmailOption } from 'app/mail/types/mail.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransactionAgs } from 'app/transaction/dto/transaction.args';

@Injectable()
export class WalletService {
  constructor(
    private userService: UsersService,
    private prismaDatabaseService: PrismaDatabaseService,
    private eventEmitter: EventEmitter2,
  ) {}

  async updateWalletBalance(walletId: string, amount: number): Promise<Wallet> {
    try {
      const wallet = await this.prismaDatabaseService.wallet.update({
        where: { id: walletId },
        data: { balance: amount },
      });
      return wallet;
    } catch (error) {
      throw new InternalErrorException();
    }
  }

  async checkIfWalletExists(userId: string): Promise<ResponseStruct> {
    try {
      const findWallet = await this.prismaDatabaseService.wallet.findFirst({
        where: { userId: userId },
      });
      if (!findWallet) throw new WalletNotFoundException();
      return {
        statusCode: HttpStatus.OK,
        message: 'wallet fetched successfully',
        data: findWallet,
      };
    } catch (error) {
      throw new InternalErrorException();
    }
  }

  public async checkSufficientFunds(
    amount: number,
    wallet: Partial<Wallet>,
  ): Promise<boolean> {
    if (wallet.balance - amount < 100) {
      return false;
    }
    return true;
  }

  public async transfer(payload: TransferArgs): Promise<ResponseStruct> {
    try {
      const ref = `transfer-${payload.userId}`;
      // find the sender wallet
      const sender = await this.checkIfWalletExists(payload?.userId);

      const senderWallet: User = sender.data;
      // check if the sender wallet balance is sufficient
      const funds = this.checkSufficientFunds(
        Number(payload.amount),
        senderWallet,
      );
      if (!funds) throw new InsufficientTokensException();

      await this.userService.validateTransactionPassword({
        userId: payload.userId,
        password: payload.transactionPassword,
      });

      const receiverUser = await this.userService.findUserByEmail(
        payload.receiver,
      );
      const ref2 = `peer-transfer-credit-${receiverUser.userId}`;

      const receiver = await this.checkIfWalletExists(receiverUser.userId);
      const receiverWallet = receiver.data;

      await this.prismaDatabaseService.$transaction(
        async (transactionalPrisma) => {
          await transactionalPrisma.wallet.updateMany({
            where: { userId: payload.userId },
            data: {
              balance: {
                decrement: Number(payload.amount),
              },
            },
          });

          await transactionalPrisma.wallet.updateMany({
            where: { userId: receiverUser.userId },
            data: {
              balance: {
                increment: Number(payload.amount),
              },
            },
          });

          const updatedReceiver = await transactionalPrisma.wallet.findFirst({
            where: { userId: receiverUser.userId },
          });
          const updatedSender = await transactionalPrisma.wallet.findFirst({
            where: { userId: senderWallet.userId },
          });

          const transactionObjSender: TransactionAgs = {
            userId: senderWallet.userId,
            amount: payload.amount,
            type: TransactionType.PEER_TRANSFER,
            status: TransactionStatus.SUCCESS,
            reference: ref,
            narration: 'peer transfer completed',
          };

          const transactionObjReceiver: TransactionAgs = {
            userId: receiverUser.userId,
            amount: payload.amount,
            type: TransactionType.CREDIT,
            status: TransactionStatus.SUCCESS,
            reference: ref2,
            narration: 'amount credited to your wallet',
          };

          await transactionalPrisma.transactions.create({
            data: transactionObjSender,
          });

          await transactionalPrisma.transactions.create({
            data: transactionObjReceiver,
          });

          const optionsReciever: EmailOption = mailStructure(
            [receiverUser.emailAddress],
            'support@moniwallet.io',
            'Notice of a Received Peer Transaction',
            config.sendGrid.templateRecieverId,
            {
              name: `${receiverUser.firstName}`,
              subject: 'Notice of a Received Peer Transaction',
              amount: `${payload.amount}`,
              address: senderWallet.emailAddress,
              balance: updatedReceiver.balance,
            },
          );

          const optionsSender: EmailOption = mailStructure(
            [senderWallet.emailAddress],
            'support@moniwallet.io',
            'Notice of a Transfer',
            config.sendGrid.templateTransferId,
            {
              name: `${senderWallet.firstName}`,
              subject: 'Notice of a Transfer',
              amount: `${payload.amount}`,
              address: receiverWallet.user.emailAddress,
              balance: updatedSender.balance,
            },
          );

          this.eventEmitter.emit('token.sent', optionsSender);
          this.eventEmitter.emit('token.recieved', optionsReciever);
        },
      );

      return {
        statusCode: HttpStatus.OK,
        message: `peer completed!, you have successfully sent ${payload.amount} tokens to user with the address ${receiverUser.emailAddress}, you (and your peer) should receive an emailAddress confirmation of the transaction`,
      };
    } catch (error) {
      throw new InternalErrorException(error.message);
    }
  }

  async getUserWallet(userId: string): Promise<Wallet> {
    try {
      const findWallet = await this.prismaDatabaseService.wallet.findFirst({
        where: { userId },
      });
      if (!findWallet) throw new WalletNotFoundException();
      return findWallet;
    } catch (error) {
      throw new InternalErrorException();
    }
  }
}

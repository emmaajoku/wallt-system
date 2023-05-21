import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { WalletService } from './wallet.service';
import { WalletModel } from './entities/wallet.entity';
import { TransferArgs } from './dto/transfer.args';
import { ResponseStruct } from './interfaces';
import { Wallet } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'app/auth/jwt-auth.guard';
import { UserJwtStrategy } from 'app/auth/guards/user.strategy';
import { customerGuard } from 'app/auth/guards/customer.guard';

@Resolver()
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(customerGuard)
  @Query(() => WalletModel)
  async getUserWallet(@Args('userId') userId: string): Promise<Wallet> {
    return this.walletService.getUserWallet(userId);
  }
  @UseGuards(customerGuard)
  @Mutation(() => WalletModel)
  async transfer(@Args() payload: TransferArgs): Promise<ResponseStruct> {
    return this.walletService.transfer(payload);
  }
}

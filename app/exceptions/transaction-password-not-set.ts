import { BadRequestException } from '@nestjs/common';

export class TransactionPasswordNotSetException extends BadRequestException {
  constructor(error?: string) {
    super('you have not set up your transaction password!', error);
  }
}

import { Module } from '@nestjs/common';
import { AccountsService } from '@synple/common/services/accounts.service';
import { AccountsController } from './accounts.controller';

export const accountsModuleDefinition = {
  controllers: [AccountsController],
  providers: [AccountsService],
}

@Module(accountsModuleDefinition)
export class AccountsModule { }

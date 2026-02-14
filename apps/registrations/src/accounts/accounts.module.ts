import { Module } from '@nestjs/common';
import { AccountsService } from '@synple/common/services/accounts.service';
import { AccountsController } from './accounts.controller';
import { MailerService, PreRegistrationsService, RegistrationsService } from '@synple/common';
import { MongoDbConnection } from '@synple/utils';
import { modelImports } from '@synple/models';

export const accountsModuleDefinition = {
  imports: [
    ...MongoDbConnection(),
    modelImports.preRegistrations,
    modelImports.registrations,
    modelImports.accounts,
  ],
  controllers: [AccountsController],
  providers: [AccountsService, RegistrationsService, PreRegistrationsService, MailerService],
}

@Module(accountsModuleDefinition)
export class AccountsModule { }

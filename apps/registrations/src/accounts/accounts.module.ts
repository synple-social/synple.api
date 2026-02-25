import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { Account, AccountsService, MailerService, PreRegistration, PreRegistrationsService, Registration, RegistrationsService } from '@synple/common';
import { SequelizeModule } from '@nestjs/sequelize';

export const accountsModuleDefinition = {
  imports: [
    SequelizeModule.forFeature([Account]),
    SequelizeModule.forFeature([Registration]),
    SequelizeModule.forFeature([PreRegistration]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService, RegistrationsService, PreRegistrationsService, MailerService],
}

@Module(accountsModuleDefinition)
export class AccountsModule { }

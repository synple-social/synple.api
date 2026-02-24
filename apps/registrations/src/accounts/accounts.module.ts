import { Module } from '@nestjs/common';
import { AccountsService } from '@synple/common/services/accounts.service';
import { AccountsController } from './accounts.controller';
import { MailerService, PreRegistrationsService, RegistrationsService } from '@synple/common';
import { Account } from '@synple/common/entities/account.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Registration } from '@synple/common/entities/registration.entity';
import { PreRegistration } from '@synple/common/entities/pre-registration.entity';

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

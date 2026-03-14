import { Module } from '@nestjs/common';
import {
  Account,
  AccountsService,
  ConfirmationCodesService,
  MailerService,
  PreRegistration,
  PreRegistrationsService,
  Registration,
  RegistrationsService,
  Role,
  Scope,
  UuidsService,
} from '@synple/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SignupsController } from './signups.controller';

export const signupsModuleDefinition = {
  imports: [
    SequelizeModule.forFeature([PreRegistration, Registration, Account, Role, Scope]),
  ],
  providers: [
    PreRegistrationsService,
    MailerService,
    ConfirmationCodesService,
    RegistrationsService,
    AccountsService,
    UuidsService,
  ],
  controllers: [SignupsController],
};

@Module(signupsModuleDefinition)
export class SignupsModule {}

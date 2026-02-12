import { Module } from '@nestjs/common';
import { MailerService, PreRegistrationsService, RegistrationsService } from '@synple/common';
import { modelImports } from '@synple/models'
import { MongoDbConnection } from '@synple/utils'
import { RegistrationsController } from './registrations.controller';

export const registrationModuleDefinition = {
  imports: [
    ...MongoDbConnection(),
    modelImports.preRegistrations,
    modelImports.registrations
  ],
  controllers: [RegistrationsController],
  providers: [PreRegistrationsService, RegistrationsService, MailerService],
}

@Module(registrationModuleDefinition)
export class RegistrationsModule { }

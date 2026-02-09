import { Module } from '@nestjs/common';
import { PreRegistrationsService } from './pre-registrations.service';
import { PreRegistrationsController } from './pre-registrations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PreRegistration, PreRegistrationSchema } from './models/pre-registration';
import { MailerService } from '../shared/services/mailer.service';
import { MongoDbConnection } from '../shared/imports/mongodb-connection';

export const preRegistrationModuleDefinition = {
  imports: [
    ...MongoDbConnection(),
    MongooseModule.forFeature([{ name: PreRegistration.name, schema: PreRegistrationSchema }])
  ],
  controllers: [PreRegistrationsController],
  providers: [PreRegistrationsService, MailerService],
}

@Module(preRegistrationModuleDefinition)
export class PreRegistrationsModule { }

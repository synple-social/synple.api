import { Module } from '@nestjs/common';
import { MailerService, PreRegistrationsService } from '@synple/common';
import { PreRegistrationsController } from './pre-registrations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PreRegistration, PreRegistrationSchema } from '@synple/models'
import { MongoDbConnection } from '@synple/utils'

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

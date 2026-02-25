import { Module } from '@nestjs/common';
import { MailerService, PreRegistration, PreRegistrationsService, Registration, RegistrationsService } from '@synple/common';
import { RegistrationsController } from './registrations.controller';
import { SequelizeModule } from '@nestjs/sequelize';

export const registrationModuleDefinition = {
  imports: [
    SequelizeModule.forFeature([PreRegistration]),
    SequelizeModule.forFeature([Registration]),
  ],
  controllers: [RegistrationsController],
  providers: [PreRegistrationsService, RegistrationsService, MailerService],
}

@Module(registrationModuleDefinition)
export class RegistrationsModule { }

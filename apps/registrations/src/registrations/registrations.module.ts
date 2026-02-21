import { Module } from '@nestjs/common';
import { MailerService, PreRegistrationsService, RegistrationsService } from '@synple/common';
import { RegistrationsController } from './registrations.controller';
import { Registration } from '@synple/common/entities/registration.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { PreRegistration } from '@synple/common/entities/pre-registration.entity';

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

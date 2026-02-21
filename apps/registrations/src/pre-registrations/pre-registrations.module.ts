import { Module } from '@nestjs/common';
import { MailerService, PreRegistrationsService } from '@synple/common';
import { PreRegistrationsController } from './pre-registrations.controller';
import { PreRegistration } from '@synple/common/entities/pre-registration.entity';
import { SequelizeModule } from '@nestjs/sequelize';

export const preRegistrationModuleDefinition = {
  imports: [SequelizeModule.forFeature([PreRegistration])],
  providers: [PreRegistrationsService, MailerService],
  controllers: [PreRegistrationsController],
}

@Module(preRegistrationModuleDefinition)
export class PreRegistrationsModule { }

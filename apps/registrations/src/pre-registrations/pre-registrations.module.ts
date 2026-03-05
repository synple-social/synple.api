import { Module } from "@nestjs/common";
import {
	ConfirmationCodesService,
	MailerService,
	PreRegistration,
	PreRegistrationsService,
} from "@synple/common";
import { PreRegistrationsController } from "./pre-registrations.controller";
import { SequelizeModule } from "@nestjs/sequelize";

export const preRegistrationModuleDefinition = {
	imports: [SequelizeModule.forFeature([PreRegistration])],
	providers: [PreRegistrationsService, MailerService, ConfirmationCodesService],
	controllers: [PreRegistrationsController],
};

@Module(preRegistrationModuleDefinition)
export class PreRegistrationsModule { }

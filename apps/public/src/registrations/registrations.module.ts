import { Module } from "@nestjs/common";
import {
	ConfirmationCodesService,
	MailerService,
	PreRegistration,
	PreRegistrationsService,
	Registration,
	RegistrationsService,
} from "@synple/common";
import { RegistrationsController } from "./registrations.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { UuidsService } from "@synple/common/services/uuids.service";

export const registrationModuleDefinition = {
	imports: [SequelizeModule.forFeature([PreRegistration, Registration])],
	controllers: [RegistrationsController],
	providers: [PreRegistrationsService, RegistrationsService, MailerService, ConfirmationCodesService, UuidsService],
};

@Module(registrationModuleDefinition)
export class RegistrationsModule { }

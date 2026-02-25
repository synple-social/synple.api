import { Module } from "@nestjs/common";
import {
	MailerService,
	PreRegistration,
	PreRegistrationsService,
} from "@synple/common";
import { PreRegistrationsController } from "./pre-registrations.controller";
import { SequelizeModule } from "@nestjs/sequelize";

export const preRegistrationModuleDefinition = {
	imports: [SequelizeModule.forFeature([PreRegistration])],
	providers: [PreRegistrationsService, MailerService],
	controllers: [PreRegistrationsController],
};

@Module(preRegistrationModuleDefinition)
export class PreRegistrationsModule {}

import { Module } from "@nestjs/common";
import { AccountsController } from "./accounts.controller";
import {
	Account,
	AccountsService,
	MailerService,
	PreRegistration,
	PreRegistrationsService,
	Registration,
	RegistrationsService,
} from "@synple/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PasswordRequest } from "@synple/common/entities/password-request.entity";

export const accountsModuleDefinition = {
	imports: [
		SequelizeModule.forFeature([Account, Registration, PreRegistration, PasswordRequest])
	],
	controllers: [AccountsController],
	providers: [
		AccountsService,
		RegistrationsService,
		PreRegistrationsService,
		MailerService,
	],
};
@Module(accountsModuleDefinition)
export class AccountsModule { }

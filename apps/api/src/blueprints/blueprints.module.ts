import { Module } from "@nestjs/common";
import { BlueprintsController } from "./blueprints.controller";
import { BlueprintsService } from "@synple/common/services/blueprints.service";
import { AccountsService, ConfirmationCodesService, EntitiesModule, MailerService, PreRegistrationsService, RegistrationsService, TokensService } from "@synple/common";

@Module({
  controllers: [ BlueprintsController],
  imports: [ EntitiesModule ],
  providers: [ BlueprintsService, TokensService, AccountsService, RegistrationsService, PreRegistrationsService, MailerService, ConfirmationCodesService, ],
})
export class BlueprintsModule { }
import { Module } from "@nestjs/common";
import { ToolsController } from "./tools.controller";
import { JwtService } from "@nestjs/jwt";
import { AccountsService, ConfirmationCodesService, MailerService, PreRegistrationsService, RegistrationsService, TokensService, UuidsService } from "@synple/common";

@Module({
  controllers: [ToolsController],
  providers: [JwtService, TokensService, UuidsService, AccountsService, RegistrationsService, PreRegistrationsService, MailerService, ConfirmationCodesService]
})
export class ToolsModule {
  
}
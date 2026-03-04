import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PasswordRequest } from "@synple/common/entities/password-request.entity";
import { PasswordsController } from "./passwords.controller";
import { Account, MailerService, PasswordsService, PreRegistration, Registration } from "@synple/common";

@Module({
  imports: [SequelizeModule.forFeature([PasswordRequest, Account, PreRegistration, Registration])],
  controllers: [PasswordsController],
  providers: [PasswordsService, MailerService]
})
export class PasswordsModule {

}
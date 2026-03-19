import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PasswordRequest } from '@synple/common/entities/password-request.entity';
import { PasswordsController } from './passwords.controller';
import {
  Account,
  ConfirmationCodesService,
  MailerService,
  PasswordsService,
  PreRegistration,
  Registration,
  Role,
  Scope,
} from '@synple/common';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PasswordRequest,
      Account,
      PreRegistration,
      Registration,
      Scope,
      Role,
    ]),
  ],
  controllers: [PasswordsController],
  providers: [PasswordsService, MailerService, ConfirmationCodesService],
})
export class PasswordsModule {}

import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from '@synple/common/services/admin/roles.service';
import {
  AccountsService,
  ConfirmationCodesService,
  MailerService,
  PreRegistrationsService,
  RegistrationsService,
  TokensService,
  UuidsService,
} from '@synple/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RolesController],
  providers: [
    RolesService,
    UuidsService,
    JwtService,
    TokensService,
    AccountsService,
    RegistrationsService,
    PreRegistrationsService,
    MailerService,
    ConfirmationCodesService,
  ],
})
export class RolesModule {}

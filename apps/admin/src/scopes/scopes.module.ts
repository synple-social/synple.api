import { Module } from '@nestjs/common';
import { ScopesController } from './scopes.controller';
import { ScopesService } from '@synple/common/services/admin/scopes.service';
import {
  AccountsService,
  ConfirmationCodesService,
  MailerService,
  PreRegistrationsService,
  RegistrationsService,
  TokensService,
  UuidsService,
} from '@synple/common';
import { ServicesModule } from '@synple/common/services/services.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ScopesController],
  providers: [
    ScopesService,
    UuidsService,
    JwtService,
    TokensService,
    AccountsService,
    RegistrationsService,
    PreRegistrationsService,
    ConfirmationCodesService,
    MailerService,
  ],
  imports: [ServicesModule],
})
export class ScopesModule {}

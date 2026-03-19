import { Module } from '@nestjs/common';
import { SynthesizersController } from './synthesizers.controller';
import { JwtService } from '@nestjs/jwt';
import {
  AccountsService,
  ConfirmationCodesService,
  MailerService,
  PreRegistrationsService,
  RegistrationsService,
  TokensService,
  UuidsService,
} from '@synple/common';

@Module({
  controllers: [SynthesizersController],
  providers: [
    JwtService,
    TokensService,
    UuidsService,
    AccountsService,
    RegistrationsService,
    PreRegistrationsService,
    MailerService,
    ConfirmationCodesService,
  ],
})
export class SynthesizersModule {}

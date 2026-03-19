import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {
  Account,
  AccountsService,
  ConfirmationCodesService,
  MailerService,
  PreRegistration,
  PreRegistrationsService,
  Registration,
  RegistrationsService,
  Role,
  Scope,
  TokensService,
  UuidsService,
} from '@synple/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Token } from '@synple/common/entities/token.entity';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      Account,
      Registration,
      PreRegistration,
      Token,
      Scope,
      Role,
    ]),
  ],
  providers: [
    TokensService,
    UuidsService,
    AccountsService,
    RegistrationsService,
    PreRegistrationsService,
    MailerService,
    ConfirmationCodesService,
  ],
})
export class AuthModule {}

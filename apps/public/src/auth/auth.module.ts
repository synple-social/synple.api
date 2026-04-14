import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {
  Account,
  AccountsService,
  PreRegistration,
  Registration,
  Role,
  Scope,
  TokensService,
} from '@synple/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from '@synple/common/entities/token.entity';

@Module({
  controllers: [AuthController],
  imports: [
    SequelizeModule.forFeature([
      Account,
      Registration,
      PreRegistration,
      Token,
      Scope,
      Role,
    ]),
  ],
  providers: [TokensService, AccountsService],
})
export class AuthModule {}

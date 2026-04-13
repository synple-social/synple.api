import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from '@synple/common/services/admin/roles.service';
import { AccountsService, TokensService } from '@synple/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RolesController],
  providers: [RolesService, JwtService, TokensService, AccountsService],
})
export class RolesModule {}

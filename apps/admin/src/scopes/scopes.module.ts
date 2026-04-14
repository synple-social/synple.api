import { Module } from '@nestjs/common';
import { ScopesController } from './scopes.controller';
import { ScopesService } from '@synple/common/services/admin/scopes.service';
import { AccountsService, TokensService } from '@synple/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ScopesController],
  providers: [ScopesService, JwtService, TokensService, AccountsService],
})
export class ScopesModule {}

import { Module } from '@nestjs/common';
import { ScopesController } from './scopes.controller';
import { ScopesService } from '@synple/common/services/admin/scopes.service';

@Module({
  controllers: [ScopesController],
  providers: [ScopesService],
})
export class ScopesModule {}

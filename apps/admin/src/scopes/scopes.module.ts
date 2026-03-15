import { Module } from '@nestjs/common';
import { ScopesController } from './scopes.controller';
import { ScopesService } from '@synple/common/services/admin/scopes.service';
import { UuidsService } from '@synple/common';

@Module({
  controllers: [ScopesController],
  providers: [ScopesService, UuidsService],
})
export class ScopesModule {}

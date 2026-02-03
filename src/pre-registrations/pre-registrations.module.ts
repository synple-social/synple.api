import { Module } from '@nestjs/common';
import { PreRegistrationsService } from './pre-registrations.service';
import { PreRegistrationsController } from './pre-registrations.controller';

@Module({
  controllers: [PreRegistrationsController],
  providers: [PreRegistrationsService],
})
export class PreRegistrationsModule {}

import { Module } from '@nestjs/common';
import { PreRegistrationsModule } from './pre-registrations/pre-registrations.module';

@Module({
  imports: [
    PreRegistrationsModule,
  ],
})
export class AppModule { }

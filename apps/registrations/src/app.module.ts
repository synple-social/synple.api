import { Module } from '@nestjs/common';
import { PreRegistrationsModule } from './pre-registrations/pre-registrations.module';
import { RegistrationsModule } from './registrations/registrations.module';

@Module({
  imports: [
    PreRegistrationsModule,
    RegistrationsModule,
  ],
})
export class AppModule { }

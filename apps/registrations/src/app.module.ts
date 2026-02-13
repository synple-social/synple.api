import { Module } from '@nestjs/common';
import { PreRegistrationsModule } from './pre-registrations/pre-registrations.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    AccountsModule,
    PreRegistrationsModule,
    RegistrationsModule,
  ],
})
export class AppModule { }

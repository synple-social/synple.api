import { Module } from '@nestjs/common';
import { PreRegistrationsModule } from './pre-registrations/pre-registrations.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { RegistrationsModule } from './registrations/registrations.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      uri: 'postgresql://babausse:strongpassword@localhost:5432',
      autoLoadModels: true,
    }),
    PreRegistrationsModule,
    RegistrationsModule,
    AccountsModule,
  ],
})
export class AppModule { }

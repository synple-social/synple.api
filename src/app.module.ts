import { Module } from '@nestjs/common';
import { PreRegistrationsModule } from './pre-registrations/pre-registrations.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [PreRegistrationsModule, MongooseModule.forRoot('mongodb://localhost/nest')],
})
export class AppModule { }

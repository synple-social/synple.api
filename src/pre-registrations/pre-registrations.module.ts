import { Module } from '@nestjs/common';
import { PreRegistrationsService } from './pre-registrations.service';
import { PreRegistrationsController } from './pre-registrations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PreRegistration, PreRegistrationSchema } from './models/pre-registration';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PreRegistration.name, schema: PreRegistrationSchema }])
  ],
  controllers: [PreRegistrationsController],
  providers: [PreRegistrationsService],
})
export class PreRegistrationsModule { }

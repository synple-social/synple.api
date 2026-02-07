import { Module } from '@nestjs/common';
import { PreRegistrationsModule } from './pre-registrations/pre-registrations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from './shared/services/mailer.service';

@Module({
  imports: [
    PreRegistrationsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URL")
      }),
      inject: [ConfigService]
    })
  ],
  providers: [MailerService]
})
export class AppModule { }

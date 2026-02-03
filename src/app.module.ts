import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PreRegistrationsModule } from './pre-registrations/pre-registrations.module';

@Module({
  imports: [PreRegistrationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

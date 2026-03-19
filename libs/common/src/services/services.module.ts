import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [JwtService],
})
export class ServicesModule {}

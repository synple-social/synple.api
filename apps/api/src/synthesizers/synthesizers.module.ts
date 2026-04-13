import { Module } from '@nestjs/common';
import { SynthesizersController } from './synthesizers.controller';
import { JwtService } from '@nestjs/jwt';
import { AccountsService, TokensService } from '@synple/common';

@Module({
  controllers: [SynthesizersController],
  providers: [JwtService, TokensService, AccountsService],
})
export class SynthesizersModule {}

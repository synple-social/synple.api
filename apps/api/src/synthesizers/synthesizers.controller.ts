import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '@synple/common';

@Controller('/synthesizers')
@ApiTags('Tools')
export class SynthesizersController {
  @Get('/')
  @UseGuards(AuthenticationGuard)
  public async index() {
    return [];
  }
}

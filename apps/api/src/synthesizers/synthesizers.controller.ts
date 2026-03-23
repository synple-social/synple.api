import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '@synple/common';
import { RequiresScope } from '@synple/common/decorators/requires-scope.decorator';

@Controller('/synthesizers')
@ApiTags('Tools')
export class SynthesizersController {
  @Get('/')
  @UseGuards(AuthenticationGuard)
  @RequiresScope('synthesizers::read')
  public async index() {
    return [];
  }
}

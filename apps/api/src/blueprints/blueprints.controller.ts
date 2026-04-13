import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { BlueprintsService } from '@synple/common/services/blueprints.service';
import { AuthenticationGuard, transformErrorPipe } from '@synple/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('/:uuid/blueprints')
export class BlueprintsController {
  constructor(private service: BlueprintsService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The blueprint has correctly been created',
  })
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(transformErrorPipe)
  public async create(@Body() { name, slots }: CreateBlueprintDto) {
    return await this.service.create({ name, slots });
  }
}

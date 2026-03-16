import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Header,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ScopesService } from '@synple/common/services/admin/scopes.service';
import { CreateScopeDto } from './dto/create-scope.dto';
import { AuthenticationGuard, transformErrorPipe } from '@synple/common';
import { createErrorSchema } from '@synple/utils';
import { successSchema } from './schemas/success.schema';
import { scopesListSchema } from './schemas/scopes-list.schema';

@Controller('scopes')
@ApiTags('Permissions')
export class ScopesController {
  constructor(private service: ScopesService) {}

  @Get('/')
  @ApiOkResponse({
    description: 'A list of the currently available scopes',
    schema: scopesListSchema,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthenticationGuard)
  public async index() {
    return await this.service.list();
  }

  @Post('/')
  @Header('Content-Type', 'application/json')
  @UsePipes(transformErrorPipe)
  @ApiBadRequestResponse({
    description: 'There was a problem with the parameters you sent in the body',
    schema: createErrorSchema('slug', 'required'),
  })
  @ApiCreatedResponse({
    description: 'The scope was successfully created',
    schema: successSchema,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthenticationGuard)
  public async create(@Body() body: CreateScopeDto) {
    return await this.service.create(body);
  }
}

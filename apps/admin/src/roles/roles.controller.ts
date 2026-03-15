import { Body, ClassSerializerInterceptor, Controller, Delete, HttpCode, Param, Post, Put, UseInterceptors, UsePipes } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { RolesService } from "@synple/common/services/admin/roles.service";
import { transformErrorPipe } from "@synple/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { createErrorSchema } from "@synple/utils";
import { roleCreatedSchema } from "./schemas/role-created.schema";
import { AddScopeDto } from "./dto/add-scope.dto";

@Controller('roles')
@ApiTags('Permissions')
export class RolesController {
  
  constructor(private service: RolesService) { }
  
  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(transformErrorPipe)
  @ApiCreatedResponse({
    description: 'The role has been correctly created.',
    schema: roleCreatedSchema,
  })
  @ApiBadRequestResponse({
    description: 'THe name was not provided to create the role correctly',
    schema: createErrorSchema('name', 'required'),
  })
  public async create(@Body() params: CreateRoleDto) {
    return await this.service.create(params)
  }

  @Delete('/:uuid')
  @HttpCode(204)
  public async delete(@Param('uuid') uuid: string) {
    await this.service.delete(uuid)
  }

  @Post('/:uuid/scopes')
  public async addScope(@Param('uuid') uuid: string, @Body() { scopeId }: AddScopeDto) {
    await this.service.addScope(uuid, scopeId)
    return { created: true }
  }

  @Delete('/:uuid/scopes/:scopeId')
  public async deleteScope(@Param('uuid') uuid: string, @Param('scopeId') scopeId: string) {

  }
}
import { Body, ClassSerializerInterceptor, Controller, Delete, HttpCode, Param, Post, Put, UseInterceptors, UsePipes } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { RolesService } from "@synple/common/services/admin/roles.service";
import { transformErrorPipe } from "@synple/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
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
  @ApiNoContentResponse({
    description: 'The role has correctly been deleted. If it contained user, they have been migrated to the default group'
  })
  public async delete(@Param('uuid') uuid: string) {
    await this.service.delete(uuid)
  }

  @Post('/:uuid/scopes')
  @ApiCreatedResponse({
    description: 'The scope has been correctly added to the role. When a role has a scope, all users having this role are considered able to use it.',
    schema: { properties: { created: { type: 'boolean' } } }
  })
  @ApiNotFoundResponse({
    description: 'Either the role or the scope have not been found in the database. Please check scopeId and uuid for typos.',
    schema: createErrorSchema('scopeId', 'unknown')
  })
  public async addScope(@Param('uuid') uuid: string, @Body() { scopeId }: AddScopeDto) {
    await this.service.addScope(uuid, scopeId)
    return { created: true }
  }

  @Delete('/:uuid/scopes/:scopeId')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'The scope and the role are no longer linked, users having this role are considered not having this scope anymore.'
  })
  @ApiNotFoundResponse({
    description: 'Either the role or the scope have not been found in the database. Please check scopeId and uuid for typos.',
    schema: createErrorSchema('scopeId', 'unknown')
  })
  public async deleteScope(@Param('uuid') uuid: string, @Param('scopeId') scopeId: string) {
    await this.service.removeScope(uuid, scopeId)
  }
}
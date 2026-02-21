import { Body, Controller, Header, Post, UseFilters } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { CreateAccountDto } from "./dto/create-account.dto";
import { AccountsService } from "@synple/common/services/accounts.service";
import { DocumentNotFoundFilter } from "@synple/common/filters/document-not-found.filter";
import { createErrorSchema } from "@synple/utils";
import { successSchema } from "./schemas/success.schema";
import { BadParameterFilter, UsernameAlreadyExistingFilter, ValidationExceptionFilter } from "@synple/common";

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {

  constructor(private readonly service: AccountsService) { }

  @Post()
  @Header('Content-Type', 'application/json')
  @UseFilters(ValidationExceptionFilter, DocumentNotFoundFilter, BadParameterFilter, UsernameAlreadyExistingFilter)
  @ApiCreatedResponse({
    schema: successSchema,
    description: 'The account has been successfully created with the given parameters.',
  })
  @ApiNotFoundResponse({
    schema: createErrorSchema('email', 'unknown'),
    description: 'The corresponding email address has not been found, or the registration UUID does not match the given email address.'
  })
  @ApiBadRequestResponse({
    schema: createErrorSchema('passwordConfirmation', 'not-matching'),
    description: 'There is a problem with one of the parameter given (eg. password and password confirmation do not match).'
  })
  async create(@Body() body: CreateAccountDto) {
    const { username, email } = (await this.service.create(body)).dataValues
    return { username, email }
  }
}
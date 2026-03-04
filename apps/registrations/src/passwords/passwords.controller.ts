import { Body, Controller, Header, HttpCode, Post, UseFilters } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { createErrorSchema } from "@synple/utils";
import { CreatePasswordRequestDto } from "./dto/create-password-request.dto";
import { BadParameterFilter, DocumentNotFoundFilter, MailerUnavailableFilter, PasswordsService, ValidationExceptionFilter } from "@synple/common";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller('passwords')
@ApiTags('Password Request')
export class PasswordsController {
  constructor(public readonly service: PasswordsService) { }

  @Post('/request')
  @Header('Content-Type', 'application/json')
  @UseFilters(MailerUnavailableFilter, ValidationExceptionFilter)
  @ApiCreatedResponse({
    description: 'The password reset email has correctly been sent.',
    schema: {},
  })
  @ApiBadRequestResponse({
    description: 'The email address was in an incorrect format.',
    schema: createErrorSchema('email', 'regexp'),
  })
  @ApiUnprocessableEntityResponse({
    description: 'The mailing service is currently unavailable and no pre-registration can be done.',
    schema: createErrorSchema('mailer', 'unavailable'),
  })
  async request(@Body() { email }: CreatePasswordRequestDto) {
    await this.service.request(email)
    return { created: true }
  }

  @Post('/reset')
  @Header('Content-Type', 'application/json')
  @ApiOkResponse({
    description: 'The password has been correctly reset with the provided value.'
  })
  @ApiBadRequestResponse({
    description: 'The password and its confirmation are not matching.',
    schema: createErrorSchema('password', 'confirmation')
  })
  @ApiForbiddenResponse({
    description: 'Either the email addresse you provided, or the confirmation code, are not matching any password reset request in our database.',
    schema: createErrorSchema('email', 'forbidden')
  })
  @UseFilters(DocumentNotFoundFilter, BadParameterFilter)
  @HttpCode(204)
  async reset(@Body() body: ResetPasswordDto) {
    await this.service.reset(body)
    return
  }
}
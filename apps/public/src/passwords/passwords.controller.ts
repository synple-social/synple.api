import {
  Body,
  Controller,
  Header,
  HttpCode,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { createErrorSchema } from '@synple/utils';
import { CreatePasswordRequestDto } from './dto/create-password-request.dto';
import {
  BadParameterFilter,
  DocumentNotFoundFilter,
  MailerUnavailableFilter,
  PasswordsService,
  transformErrorPipe,
  ValidationExceptionFilter,
} from '@synple/common';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('passwords')
@ApiTags('Password recover')
export class PasswordsController {
  constructor(public readonly service: PasswordsService) {}

  @Post('/request')
  @Header('Content-Type', 'application/json')
  @UseFilters(MailerUnavailableFilter, ValidationExceptionFilter)
  @UsePipes(transformErrorPipe)
  @ApiCreatedResponse({
    description: 'The password reset email has correctly been sent.',
    schema: {},
  })
  @ApiBadRequestResponse({
    description: 'The email address was in an incorrect format.',
    schema: createErrorSchema('email', 'regexp'),
  })
  @ApiUnprocessableEntityResponse({
    description:
      'The mailing service is currently unavailable and no pre-registration can be done.',
    schema: createErrorSchema('mailer', 'unavailable'),
  })
  async request(@Body() { email }: CreatePasswordRequestDto) {
    await this.service.request(email);
    return { created: true };
  }

  @Post('/reset')
  @Header('Content-Type', 'application/json')
  @ApiNoContentResponse({
    description:
      'The password has been correctly reset with the provided value.',
  })
  @ApiBadRequestResponse({
    description:
      'There is an issue with the data you provided in the JSON body. Either a required key is missing, or the password does not match the password confirmation.',
    schema: createErrorSchema('password', 'confirmation'),
  })
  @ApiForbiddenResponse({
    description:
      'Either the email addresse you provided, or the confirmation code, are not matching any password reset request in our database.',
    schema: createErrorSchema('email', 'forbidden'),
  })
  @UseFilters(DocumentNotFoundFilter, BadParameterFilter)
  @UsePipes(transformErrorPipe)
  @HttpCode(204)
  async reset(@Body() body: ResetPasswordDto) {
    await this.service.reset(body);
    return;
  }
}

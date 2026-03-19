import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Header,
  Post,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SignupsPreRegisterDto } from './dto/signups-pre-register.dto';
import {
  AccountsService,
  BadParameterFilter,
  DocumentNotFoundFilter,
  MailerUnavailableFilter,
  PreRegistrationsService,
  RegistrationsService,
  transformErrorPipe,
  UsernameAlreadyExistingFilter,
  ValidationExceptionFilter,
} from '@synple/common';
import { CreatedSchema, createErrorSchema } from '@synple/utils';
import { SuccessSchema } from './schemas/registration.schema';
import { SignupsRegisterDto } from './dto/signups-register.dto';
import { AccountSchema } from './schemas/account.schema';
import { SignupsCompleteDto } from './dto/signups-complete.dto';

@Controller('signups')
@ApiTags('Sign-up')
export class SignupsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly registrationService: RegistrationsService,
    private readonly preRegistrationsService: PreRegistrationsService,
  ) {}

  @Post('/pre-register')
  @Header('Content-Type', 'application/json')
  @UseFilters(MailerUnavailableFilter, ValidationExceptionFilter)
  @ApiCreatedResponse({
    description: 'The confirmation email has correctly been sent.',
    schema: CreatedSchema,
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
  async preRegister(@Body() { email }: SignupsPreRegisterDto) {
    const preRegistration = await this.preRegistrationsService.create(email);
    return { id: preRegistration.uuid };
  }

  @Post('/register')
  @Header('Content-Type', 'application/json')
  @UseFilters(ValidationExceptionFilter, DocumentNotFoundFilter)
  @ApiCreatedResponse({
    description:
      'When the registration is correctly created (the email and the confirmation code are valid and matching',
    schema: SuccessSchema,
  })
  @ApiNotFoundResponse({
    description:
      'When the email is not found, or the confirmation code is not found, or both are not matching.',
    schema: createErrorSchema('email', 'unknown'),
  })
  async register(@Body() { email, confirmationCode }: SignupsRegisterDto) {
    const registration = await this.registrationService.create(
      email,
      confirmationCode,
    );
    return { id: registration.uuid };
  }

  @Post('/complete')
  @Header('Content-Type', 'application/json')
  @UseFilters(
    ValidationExceptionFilter,
    DocumentNotFoundFilter,
    BadParameterFilter,
    UsernameAlreadyExistingFilter,
  )
  @ApiCreatedResponse({
    schema: AccountSchema,
    description:
      'The account has been successfully created with the given parameters.',
  })
  @ApiNotFoundResponse({
    schema: createErrorSchema('email', 'unknown'),
    description:
      'The corresponding email address has not been found, or the registration UUID does not match the given email address.',
  })
  @ApiBadRequestResponse({
    schema: createErrorSchema('passwordConfirmation', 'not-matching'),
    description:
      'There is a problem with one of the parameter given (eg. password and password confirmation do not match).',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(transformErrorPipe)
  async complete(@Body() body: SignupsCompleteDto) {
    return await this.accountsService.create(body);
  }
}

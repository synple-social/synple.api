import { Body, Controller, Header, Post, UseFilters } from '@nestjs/common';
import { PreRegistrationsService } from '@synple/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreatePreRegistrationDto } from './dto/create-pre-registration.dto';
import { ValidationExceptionFilter } from '@synple/utils'
import { SuccessSchema } from './schemas/create/success.schema';
import { ErrorSchema } from '@synple/utils';

@Controller('pre-registrations')
@ApiTags('pre-registrations')
export class PreRegistrationsController {
  constructor(private readonly preRegistrationsService: PreRegistrationsService) {}

  @Post()
  @Header('Content-Type', 'application/json')
  @UseFilters(ValidationExceptionFilter)
  @ApiCreatedResponse({
    description: 'The confirmation email has correctly been sent',
    schema: SuccessSchema
  })
  @ApiBadRequestResponse({
    description: 'The email address was in an incorrect format',
    schema: ErrorSchema
  })
  async create(@Body() { email }: CreatePreRegistrationDto) {
    await this.preRegistrationsService.create(email)
    return { created: true }
  }
}

import { Body, Controller, Header, Post, UseFilters } from '@nestjs/common';
import { PreRegistrationsService } from './pre-registrations.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreatePreRegistrationDto } from './dto/create-pre-registration.dto';
import { ValidationExceptionFilter } from '../shared/filters/validation-exception.filter';
import { SuccessSchema } from './schemas/create/success.schema';
import { ErrorSchema } from '../shared/schemas/error.schema';

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

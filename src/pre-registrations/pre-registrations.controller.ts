import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { PreRegistrationsService } from './pre-registrations.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePreRegistrationDto } from './dto/create-pre-registration.dto';
import { ValidationExceptionFilter } from 'src/filters/validation-exception.filter';

@Controller('pre-registrations')
@ApiTags('pre-registrations')
export class PreRegistrationsController {
  constructor(private readonly preRegistrationsService: PreRegistrationsService) { }

  @Post()
  @UseFilters(new ValidationExceptionFilter())
  @ApiResponse({ status: 201, description: 'The confirmation email has correctly been sent' })
  @ApiResponse({ status: 400, description: 'The email address was in an incorrect format' })
  async create(@Body() { email }: CreatePreRegistrationDto) {
    await this.preRegistrationsService.create(email)
    return JSON.stringify({ created: true })
  }
}

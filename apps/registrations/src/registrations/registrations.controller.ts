import { Body, Controller, Header, Post, UseFilters } from "@nestjs/common";
import { ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { ValidationExceptionFilter } from "@synple/common";
import { CreateRegistrationDto } from "./dto/create-registration.dto";
import { RegistrationsService } from "@synple/common/services/registrations.service";
import { ErrorSchema } from "@synple/utils";
import { SuccessSchema } from "./schemas/registration.schema";
import { DocumentNotFoundFilter } from "@synple/common/filters/document-not-found.filter";

@Controller('registrations')
@ApiTags('registrations')
export class RegistrationsController {

  constructor(readonly service: RegistrationsService) {}

  @Post()
  @Header('Content-Type', 'application/json')
  @UseFilters(ValidationExceptionFilter)
  @UseFilters(DocumentNotFoundFilter)
  @ApiCreatedResponse({
    description: 'When the registration is correctly created (the email and the confirmation code are valid and matching',
    schema: SuccessSchema,
  })
  @ApiNotFoundResponse({
    description: 'When the email is not found, or the confirmation code is not found, or both are not matching.',
    schema: ErrorSchema,
  })
  async create(@Body() { email, confirmationCode }: CreateRegistrationDto) {
    const registration = await this.service.create(email, confirmationCode)
    return { id: registration._id }
  }
}
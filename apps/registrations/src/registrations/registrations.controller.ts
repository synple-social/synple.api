import { Controller, Header, Post, UseFilters } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ValidationExceptionFilter } from "@synple/common";

@Controller('registrations')
@ApiTags('registrations')
export class RegistrationsController {
  @Post()
  @Header('Content-Type', 'application/json')
  @UseFilters(ValidationExceptionFilter)
  async create() {
    
  }
}
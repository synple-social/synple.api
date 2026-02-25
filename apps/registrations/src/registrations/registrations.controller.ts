import { Body, Controller, Header, Post, UseFilters } from "@nestjs/common";
import {
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiTags,
} from "@nestjs/swagger";
import { CreateRegistrationDto } from "./dto/create-registration.dto";
import {
	DocumentNotFoundFilter,
	RegistrationsService,
	ValidationExceptionFilter,
} from "@synple/common";
import { createErrorSchema } from "@synple/utils";
import { SuccessSchema } from "./schemas/registration.schema";

@Controller("registrations")
@ApiTags("registrations")
export class RegistrationsController {
	constructor(readonly service: RegistrationsService) {}

	@Post()
	@Header("Content-Type", "application/json")
	@UseFilters(ValidationExceptionFilter, DocumentNotFoundFilter)
	@ApiCreatedResponse({
		description:
			"When the registration is correctly created (the email and the confirmation code are valid and matching",
		schema: SuccessSchema,
	})
	@ApiNotFoundResponse({
		description:
			"When the email is not found, or the confirmation code is not found, or both are not matching.",
		schema: createErrorSchema("email", "unknown"),
	})
	async create(@Body() { email, confirmationCode }: CreateRegistrationDto) {
		const registration = await this.service.create(email, confirmationCode);
		return { id: registration.uuid };
	}
}

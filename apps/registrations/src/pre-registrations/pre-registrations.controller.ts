import { Body, Controller, Header, Post, UseFilters } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiTags,
	ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { CreatePreRegistrationDto } from "./dto/create-pre-registration.dto";
import {
	MailerUnavailableFilter,
	PreRegistrationsService,
	ValidationExceptionFilter,
} from "@synple/common";
import { SuccessSchema } from "./schemas/create/success.schema";
import { createErrorSchema } from "@synple/utils";

@Controller("pre-registrations")
@ApiTags("pre-registrations")
export class PreRegistrationsController {
	constructor(
		private readonly preRegistrationsService: PreRegistrationsService,
	) { }

	@Post()
	@Header("Content-Type", "application/json")
	@UseFilters(MailerUnavailableFilter, ValidationExceptionFilter)
	@ApiCreatedResponse({
		description: "The confirmation email has correctly been sent.",
		schema: SuccessSchema,
	})
	@ApiBadRequestResponse({
		description: "The email address was in an incorrect format.",
		schema: createErrorSchema("email", "regexp"),
	})
	@ApiUnprocessableEntityResponse({
		description:
			"The mailing service is currently unavailable and no pre-registration can be done.",
		schema: createErrorSchema("mailer", "unavailable"),
	})
	async create(@Body() { email }: CreatePreRegistrationDto) {
		await this.preRegistrationsService.create(email);
		return { created: true };
	}
}

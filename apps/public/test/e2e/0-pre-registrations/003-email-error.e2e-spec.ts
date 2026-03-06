import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import {
	MailerService,
	MailPayload,
	PreRegistration,
	PreRegistrationsService,
} from "@synple/common";
import supertest from "supertest";
import { MailerUnavailableException } from "@synple/utils";
import { createApplication } from "../../helpers/create-application.helper.ts";

class MockMailerService extends MailerService {
	async send(_: MailPayload) {
		throw new MailerUnavailableException();
	}
}

describe("Pre registrations scenarios", () => {
	let app: INestApplication<App>;

	const email = "test_003@mail.com";

	beforeAll(async () => {
		app = await createApplication({
			overrides: [{ from: MailerService, to: MockMailerService }],
		});
	});

	describe("[SC-003] There is an unknown error happening when a user attemps to make a pre registration creation", () => {
		let response: supertest.Test;
		let model: typeof PreRegistration;

		beforeAll(() => {
			response = request(app.getHttpServer())
				.post("/pre-registrations")
				.set("Accept", "application/json")
				.send({ email });
			model = app.get(PreRegistrationsService).model;
		});
		it("Returns a 422 (Unprocessable Entity) status code and the correct body", () => {
			return response
				.expect(422)
				.expect("Content-Type", /json/)
				.expect({ path: "mailer", error: "unavailable" });
		});
		it("Has not created a pre registration for this email address", async () => {
			expect((await model.findAll({ where: { email } })).length).toBe(0);
		});
	});
});

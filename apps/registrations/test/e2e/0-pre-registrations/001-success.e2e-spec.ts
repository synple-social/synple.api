import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { createPreregistration } from "../../http/create-pre-registration.http";
import { createApplication } from "../../helpers/create-test-module.helper";
import { PreRegistration, PreRegistrationsService } from "@synple/common";

describe("Pre-registrations scenarios", () => {
	const email = "email_001@test.com";

	let app: INestApplication<App>;

	beforeAll(async () => {
		app = await createApplication();
	});

	describe("[SC-001] a pre registration is created successfully", () => {
		let response: any;

		beforeAll(async () => {
			response = createPreregistration(email, app);
		});

		it("Returns a 201 (Created) status code with the correct body", () => {
			return response
				.expect(201)
				.expect("Content-Type", /application\/json/)
				.expect({ created: true });
		});
		describe("The created pre-registration", () => {
			let preRegistration: PreRegistration | null;

			beforeAll(async () => {
				const model: typeof PreRegistration = app.get(
					PreRegistrationsService,
				).model;
				preRegistration = await model
					.scope("valid")
					.findOne({ where: { email } });
			});

			it("Has created a document in the database", () => {
				expect(preRegistration).not.toBe(null);
			});
			it("Has created a document with a confirmation code", async () => {
				expect(preRegistration?.dataValues?.confirmationCode).toMatch(
					/^[A-Z0-9]{6}$/,
				);
			});
		});
	});
});

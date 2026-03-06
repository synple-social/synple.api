import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { createPreregistration, createRegistration } from "../../http";
import { Registration, RegistrationsService } from "@synple/common";
import { createApplication } from "../../helpers/create-application.helper.ts";

describe("Registrations scenarios", () => {
	const email = "email_001@test.com";

	let app: INestApplication<App>;

	beforeAll(async () => {
		app = await createApplication();
	});

	describe("[SC-103] a registration is created with an invalid confirmation code", () => {
		let response: any;
		let model: typeof Registration;
		beforeAll(async () => {
			await createPreregistration(email, app);
			model = app.get(RegistrationsService).model;
			response = createRegistration(email, "XYZ456", app);
		});

		it("Returns a 404 (Not Found) status code with the correct body", () => {
			return response
				.expect(404)
				.expect("Content-Type", /application\/json/)
				.expect({ path: "email", error: "unknown" });
		});
		it("Has created no registration in the database", async () => {
			await response;
			expect(await model.count()).toBe(0);
		});
	});
});

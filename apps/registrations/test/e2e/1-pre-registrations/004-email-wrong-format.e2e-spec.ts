import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { PreRegistrationsService } from "@synple/common";
import { createApplication } from "../../helpers/create-test-module.helper";

describe("Pre-registrations scenarios", () => {
	let app: INestApplication<App>;

	const email = "invalid email";

	beforeAll(async () => {
		app = await createApplication();
	});

	describe("[SC-004] a pre registration creation attempt with an invalid format email", () => {
		it("Returns a 400 (Bad Request) status code and the correct body", () => {
			return request(app.getHttpServer())
				.post("/pre-registrations")
				.set("Accept", "application/json")
				.send({ email })
				.expect(400)
				.expect("Content-Type", /json/)
				.expect({ path: "email", error: "format" });
		});
		it("Has created no pre registration in the database", async () => {
			const model = app.get(PreRegistrationsService).model;
			expect(await model.count({ where: { email } })).toBe(0);
		});
	});
});

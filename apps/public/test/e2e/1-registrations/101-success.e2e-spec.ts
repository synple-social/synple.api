import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { createPreregistration, createRegistration } from "../../http";
import {
	PreRegistration,
	PreRegistrationsService,
	Registration,
	RegistrationsService,
} from "@synple/common";
import { createApplication } from "../../helpers/create-application.helper.ts";
import { TEST_UUID, UuidsMock } from "../../mocks/uuids.mock";
import { UuidsService } from "@synple/common/services/uuids.service";

describe("Registrations scenarios", () => {
	const email = "email_001@test.com";

	let app: INestApplication<App>;

	beforeAll(async () => {
		app = await createApplication({
			overrides: [{ from: UuidsService, to: UuidsMock }]
		});
	});

	describe("[SC-101] a registration is created successfully", () => {
		let response: any;
		let models: {
			preRegistration?: typeof PreRegistration;
			registration?: typeof Registration;
		} = {};
		beforeAll(async () => {
			models.preRegistration = app.get(PreRegistrationsService).model;
			models.registration = app.get(RegistrationsService).model;

			await createPreregistration(email, app);
			response = createRegistration(email, 'ABC123', app);
		});

		it("Returns a 201 (Created) status code with the correct body", async () => {
			const { res } = await response
				.expect(201)
				.expect("Content-Type", /application\/json/);
			expect(JSON.parse(res.text).id).toEqual(
				(await models.registration?.findByPk(1))?.uuid,
			);
		});
		it("Has linked a pre-registration to the created registration", async () => {
			const registration = await models.registration?.findOne({
				where: { email },
				include: PreRegistration,
			});
			const preRegistrations = await registration?.getPreRegistrations();
			expect(preRegistrations?.map((pr) => pr.id)).toEqual([1]);
		});
		it("Has linked back the pre-registration to the registration", async () => {
			const preRegistration = await models.preRegistration?.findOne({
				where: { email },
				include: Registration,
			});
			expect(preRegistration?.registration?.id).toEqual(1);
		});
		it("Has given an UUID to the registration later used to identify users", async () => {
			const registration = await models.registration?.findOne({
				where: { email },
			});
			expect(registration?.uuid).toEqual(TEST_UUID)
		});
	});
});

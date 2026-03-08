import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { createPreregistration, createRegistration } from "../../../http";
import {
	Account,
	AccountsService,
	PreRegistration,
	PreRegistrationsService,
	Registration,
	RegistrationsService,
} from "@synple/common";
import { createAccount } from "../../../http/create-account.http";
import { createApplication } from "../../../helpers/create-application.helper.ts";
import { compare } from "bcrypt";
import { TEST_UUID, UuidsMock } from "../../../mocks/uuids.mock";
import { UuidsService } from "@synple/common/services/uuids.service";

describe("Accounts scenarios", () => {
	const email = "email_001@test.com";

	let app: INestApplication<App>;

	beforeAll(async () => {
		app = await createApplication({
			overrides: [{ from: UuidsService, to: UuidsMock }]
		});
	});

	describe("[CPT-001] the account is created successfully", () => {
		let response: any;
		let models!: {
			preRegistrations: typeof PreRegistration;
			registrations: typeof Registration;
			accounts: typeof Account;
		};
		beforeAll(async () => {
			models = {
				preRegistrations: app.get(PreRegistrationsService).model,
				registrations: app.get(RegistrationsService).model,
				accounts: app.get(AccountsService).model,
			};

			await createPreregistration(email, app);
			await createRegistration(email, 'ABC123', app);
			const registration = await models.registrations.findOne({
				where: { email },
			});
			response = createAccount(
				{
					email,
					registrationId: registration?.getDataValue("uuid"),
					password: "password",
					passwordConfirmation: "password",
					username: "testUser",
				},
				app,
			);
		});

		it("Returns a 201 (Created) status code with the correct body", () => {
			return response
				.expect(201)
				.expect("Content-Type", /application\/json/)
				.expect({ email, username: "testUser" });
		});
		it("Has created a valid account in the database", async () => {
			await response;
			expect(await models.accounts.count()).toBe(1);
		});
		describe("The created account attributes", () => {
			let account!: Account;

			beforeAll(async () => {
				account = (await models.accounts.findByPk(1, {
					include: Registration,
				})) as Account;
			});

			it("Has the correct registration ID", () => {
				expect(account.registration.id).toEqual(1);
			});
			it("Has the correct email address", () => {
				expect(account.email).toEqual(email);
			});
			it("Has the correct username", () => {
				expect(account.username).toEqual("testUser");
			});
			it("Can authenticate with the correct password", async () => {
				expect(await compare("password", account.passwordDigest)).toEqual(true);
			});
			it("Has an UUID later used to identify users", () => {
				expect(account.uuid).toEqual(TEST_UUID)
			});
			it("Has a JWT secret used later to generate tokens", () => {
				expect(account.jwtSecret).toEqual(TEST_UUID)
			})
		});
	});
});

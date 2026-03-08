import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import {
  MailerService,
  MailPayload,
  PasswordsService,
} from "@synple/common";
import supertest from "supertest";
import { MailerUnavailableException } from "@synple/utils";
import { createApplication } from '../../../helpers/create-application.helper.ts';
import { PasswordRequest } from "@synple/common/entities/password-request.entity";
import { hash } from "bcrypt"

class MockMailerService extends MailerService {
  async send(_: MailPayload) {
    throw new MailerUnavailableException();
  }
}

describe("Password reset requests scenarios", () => {
  let app: INestApplication<App>;

  const email = "test_003@mail.com";

  beforeAll(async () => {
    app = await createApplication({
      overrides: [{ from: MailerService, to: MockMailerService }],
    });
  });

  describe("[PWQ-003] There is an unknown error happening when a user attemps to make a password reset request", () => {
    let response: supertest.Test;
    let model: typeof PasswordRequest;

    beforeAll(async () => {
      const account = app.get(PasswordsService).accounts
      await account.create({ email, passwordDigest: await hash("password", 1), uuid: "1", username: "testuser" })
      response = request(app.getHttpServer())
        .post("/passwords/request")
        .set("Accept", "application/json")
        .send({ email });
      model = app.get(PasswordsService).model;
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

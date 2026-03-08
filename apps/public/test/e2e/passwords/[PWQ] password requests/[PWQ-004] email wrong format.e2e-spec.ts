import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { PasswordsService } from "@synple/common";
import { createApplication } from '../../../helpers/create-application.helper.ts';
import { hash } from "bcrypt"

describe("Password reset requests scenarios", () => {
  let app: INestApplication<App>;

  const email = "invalid email";

  beforeAll(async () => {
    app = await createApplication();
    const account = app.get(PasswordsService).accounts
    await account.create({ email, passwordDigest: await hash("password", 1), uuid: "1", username: "testuser" })
  });

  describe("[PWQ-004] a password reset request attempt with an invalid format email", () => {
    it("Returns a 400 (Bad Request) status code and the correct body", () => {
      return request(app.getHttpServer())
        .post("/passwords/request")
        .set("Accept", "application/json")
        .send({ email })
        .expect(400)
        .expect("Content-Type", /json/)
        .expect({ path: "email", error: "format" });
    });
    it("Has created no pre registration in the database", async () => {
      const model = app.get(PasswordsService).model;
      expect(await model.count({ where: { email } })).toBe(0);
    });
  });
});

import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { PasswordsService } from "@synple/common";
import { createApplication } from '../../helpers/create-application.helper.ts';
import { PasswordRequest } from "@synple/common/entities/password-request.entity";
import request from "supertest"
import { hash } from "bcrypt"

describe("Password reset requests scenarios", () => {
  let app: INestApplication<App>;

  const email = "test_002@mail.com";

  beforeAll(async () => {
    app = await createApplication();
  });

  describe("[SC-302] two consecutive password reset requests are done by the same user", () => {
    let response: any;
    let model!: typeof PasswordRequest;

    beforeAll(async () => {
      const account = app.get(PasswordsService).accounts
      await account.create({ email, passwordDigest: await hash("password", 1), uuid: "1", username: "testuser" })
      await request(app.getHttpServer())
        .post("/passwords/request")
        .set("Accept", "application/json")
        .send({ email })
      response = request(app.getHttpServer())
        .post("/passwords/request")
        .set("Accept", "application/json")
        .send({ email })
      model = app.get(PasswordsService).model;
    });
    it("Returns a 201 (Created) status code", async () => {
      return response
        .expect(201)
        .expect("Content-Type", /json/)
        .expect({ created: true });
    });
    it("Has created only two pre registrations", async () => {
      expect((await model.findAll({ where: { email } })).length).toBe(2);
    });
    it("Has created one invalidated pre registration", async () => {
      expect(
        (await model.scope("invalid").findAll({ where: { email } })).length,
      ).toBe(1);
    });
    it("Has created one valid pre registration", async () => {
      expect(
        (await model.scope("valid").findAll({ where: { email } })).length,
      ).toBe(1);
    });
    it("Has created the invalidated pre registration before the valid one", async () => {
      const invalidated = await model
        .scope("invalid")
        .findOne({ where: { email } });
      const valid = await model.scope("valid").findOne({ where: { email } });
      expect(invalidated?.createdAt?.getTime() || 0).toBeLessThan(
        valid?.createdAt?.getTime() || Number.NEGATIVE_INFINITY,
      );
    });
  });
});
